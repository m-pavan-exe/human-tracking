import os
import torch
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from model.lstm_model import ModelTrainer

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = os.path.join('backend', 'model', 'saved_models', 'best_model.pth')
ALLOWED_EXTENSIONS = {'csv'}

# Initialize the model
input_size = 256  # Number of CSI subcarriers
trainer = ModelTrainer(input_size)

# Load model at startup
@app.before_request
def load_model():
    if os.path.exists(MODEL_PATH):
        trainer.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}. Please train the model first.")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/predict', methods=['POST'])
def predict():
    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    # Check if filename is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Check if file extension is allowed
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file format. Only CSV files are allowed.'}), 400
    
    try:
        # Read CSV data
        df = pd.read_csv(file)
        
        # Extract CSI features
        csi_columns = [col for col in df.columns if col.startswith('csi_')]
        features = df[csi_columns].values
        
        # If features is a single sample, it will be 1D
        if features.ndim == 1:
            # Single sample, already handled by updated ModelTrainer.predict
            pass
        
        # Make predictions
        presence_pred, pose_class = trainer.predict(features)
        presence_pred = np.atleast_1d(presence_pred).flatten()
        human_presence = bool(presence_pred[0] > 0.5)
        
        # Ensure presence_pred is properly handled whether it's a list, numpy array, or scalar
        #if hasattr(presence_pred, "__iter__"):
            #human_presence = bool(presence_pred[0] > 0.5)
        #else:
            #human_presence = bool(presence_pred > 0.5)
        
        # Ensure pose_class is properly handled
        pose = pose_class[0] if human_presence else 'None'
        
        # Extract joint coordinates if available
        joint_coordinates = []
        if all(f'joint_{i}_x' in df.columns for i in range(17)) and all(f'joint_{i}_y' in df.columns for i in range(17)):
            for i in range(17):
                x = float(df[f'joint_{i}_x'].values[0])
                y = float(df[f'joint_{i}_y'].values[0])
                joint_coordinates.append({'x': x, 'y': y})
        else:
            # Generate default coordinates based on pose
            # This is simplified and would need to be replaced with your actual logic
            joint_coordinates = [{'x': 0, 'y': 0} for _ in range(17)]
        
        result = {
            'humanPresence': human_presence,
            'pose': pose,
            'confidence': float(np.random.uniform(0.7, 0.99)),  # Just a placeholder
            'jointCoordinates': joint_coordinates
        }
        
        return jsonify(result)
    
    except Exception as e:
        import traceback
        print(f"Error processing request: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
