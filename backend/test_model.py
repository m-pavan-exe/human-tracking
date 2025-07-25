import os
import pandas as pd
import numpy as np
from model.lstm_model import ModelTrainer

def test_model():
    print("Testing WiFi Pose Guardian LSTM Model\n")
    
    # Initialize model
    input_size = 256  # Number of CSI subcarriers
    trainer = ModelTrainer(input_size)
    
    # Load model
    model_path = 'backend/model/saved_models/best_model.pth'
    if not os.path.exists(model_path):
        print(f"Error: No trained model found at {model_path}. Please run the training script first.")
        return
    
    try:
        trainer.load_model(model_path)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return
    
    # Load test samples
    test_samples_dir = os.path.join('..', 'data', 'test_samples')
    if not os.path.exists(test_samples_dir):
        print(f"Error: No test samples found at {test_samples_dir}.")
        # Try alternate path
        test_samples_dir = os.path.join('data', 'test_samples')
        if not os.path.exists(test_samples_dir):
            print(f"Error: No test samples found at {test_samples_dir} either. Please run generate_test_samples.py first.")
            return
    
    # Test each sample
    for filename in os.listdir(test_samples_dir):
        if filename.endswith('.csv'):
            print(f"\nTesting {filename}...")
            
            # Load sample
            sample_path = os.path.join(test_samples_dir, filename)
            try:
                df = pd.read_csv(sample_path)
                
                # Extract features
                csi_columns = [col for col in df.columns if col.startswith('csi_')]
                features = df[csi_columns].values
                
                # Make prediction
                try:
                    presence_pred, pose_pred = trainer.predict(features)
                    
                    # Handle presence prediction
                    presence_result = "Yes" if presence_pred.item() > 0.5 else "No"
                    
                    # Handle pose prediction - pose_pred is already processed by label_encoder
                    pose_result = pose_pred[0] if len(pose_pred) > 0 else pose_pred
                    
                    # Print results
                    print(f"Predicted pose: {pose_result}")
                    print(f"Human presence: {presence_result}")
                
                except Exception as e:
                    print(f"Error during prediction: {str(e)}")
                    raise  # Re-raise to see full traceback
            
            except Exception as e:
                print(f"Error loading file {sample_path}: {str(e)}")
                raise  # Re-raise to see full traceback

if __name__ == "__main__":
    test_model()
