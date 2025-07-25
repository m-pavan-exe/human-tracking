import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import Dataset, DataLoader
import pickle

class WiFiCSIDataset(Dataset):
    def __init__(self, csv_file):
        self.data = pd.read_csv(csv_file)
        self.label_encoder = LabelEncoder()
        self.data['pose_class_encoded'] = self.label_encoder.fit_transform(self.data['pose_class'])
        
        # Extract features and labels
        self.csi_columns = [col for col in self.data.columns if col.startswith('csi_')]
        self.features = torch.FloatTensor(self.data[self.csi_columns].values)
        self.presence_labels = torch.FloatTensor(self.data['human_presence'].values)
        self.pose_labels = torch.LongTensor(self.data['pose_class_encoded'].values)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return (
            self.features[idx],
            self.presence_labels[idx],
            self.pose_labels[idx]
        )

    def get_label_encoder(self):
        return self.label_encoder

class WiFiPoseModel(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes):
        super(WiFiPoseModel, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM layer
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True
        )
        
        # Fully connected layers
        self.fc1 = nn.Linear(hidden_size, 128)
        self.dropout = nn.Dropout(0.3)
        self.relu = nn.ReLU()
        
        # Output layers
        self.fc_presence = nn.Linear(128, 1)
        self.fc_pose = nn.Linear(128, num_classes)
        
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Reshape input for LSTM [batch, 1, features]
        x = x.unsqueeze(1)
        
        # Initialize hidden state
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        
        # Forward propagate LSTM
        lstm_out, _ = self.lstm(x, (h0, c0))
        
        # Extract the output of the last time step
        out = lstm_out[:, -1, :]
        
        # Common layers
        out = self.fc1(out)
        out = self.dropout(out)
        out = self.relu(out)
        
        # Separate outputs for presence and pose
        presence_out = self.sigmoid(self.fc_presence(out))
        pose_out = self.fc_pose(out)
        
        return presence_out.squeeze(), pose_out

class ModelTrainer:
    def __init__(self, input_size, hidden_size=128, num_layers=2, num_classes=5):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = WiFiPoseModel(input_size, hidden_size, num_layers, num_classes).to(self.device)
        self.criterion_presence = nn.BCELoss()
        self.criterion_pose = nn.CrossEntropyLoss()
        self.optimizer = optim.Adam(self.model.parameters())
        self.label_encoder = None
        # Initialize default label encoder with pose classes if one isn't loaded
        self._init_default_label_encoder()

    def _init_default_label_encoder(self):
        """Initialize a default label encoder with standard pose classes."""
        pose_classes = ['stand', 'sit', 'kneel', 'sleep', 'no_human']
        self.label_encoder = LabelEncoder()
        self.label_encoder.fit(pose_classes)
        print("Default label encoder initialized")

    def train(self, train_csv, valid_csv, num_epochs=50, batch_size=32):
        # Create datasets
        train_dataset = WiFiCSIDataset(train_csv)
        valid_dataset = WiFiCSIDataset(valid_csv)
        self.label_encoder = train_dataset.get_label_encoder()

        # Create data loaders
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        valid_loader = DataLoader(valid_dataset, batch_size=batch_size)

        best_valid_loss = float('inf')
        
        for epoch in range(num_epochs):
            # Training
            self.model.train()
            train_loss = 0
            for features, presence_labels, pose_labels in train_loader:
                features = features.to(self.device)
                presence_labels = presence_labels.to(self.device)
                pose_labels = pose_labels.to(self.device)

                self.optimizer.zero_grad()
                presence_out, pose_out = self.model(features)
                
                loss_presence = self.criterion_presence(presence_out, presence_labels)
                loss_pose = self.criterion_pose(pose_out, pose_labels)
                loss = loss_presence + loss_pose
                
                loss.backward()
                self.optimizer.step()
                train_loss += loss.item()

            # Validation
            self.model.eval()
            valid_loss = 0
            with torch.no_grad():
                for features, presence_labels, pose_labels in valid_loader:
                    features = features.to(self.device)
                    presence_labels = presence_labels.to(self.device)
                    pose_labels = pose_labels.to(self.device)

                    presence_out, pose_out = self.model(features)
                    
                    loss_presence = self.criterion_presence(presence_out, presence_labels)
                    loss_pose = self.criterion_pose(pose_out, pose_labels)
                    loss = loss_presence + loss_pose
                    valid_loss += loss.item()

            print(f'Epoch {epoch+1}/{num_epochs}:')
            print(f'Training Loss: {train_loss/len(train_loader):.4f}')
            print(f'Validation Loss: {valid_loss/len(valid_loader):.4f}')

            # Save best model
            if valid_loss < best_valid_loss:
                best_valid_loss = valid_loss
                self.save_model('backend/model/saved_models/best_model.pth')

    def save_model(self, path):
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Save model state dict
        torch.save(self.model.state_dict(), path)
        
        # Save label encoder separately
        encoder_path = os.path.join(os.path.dirname(path), 'label_encoder.pkl')
        with open(encoder_path, 'wb') as f:
            pickle.dump(self.label_encoder, f)
        print(f"Model and label encoder saved to {os.path.dirname(path)}")

    def load_model(self, path):
        # Load model state dict
        self.model.load_state_dict(torch.load(path, map_location=self.device))
        
        # Load label encoder separately
        encoder_path = os.path.join(os.path.dirname(path), 'label_encoder.pkl')
        if os.path.exists(encoder_path):
            try:
                with open(encoder_path, 'rb') as f:
                    self.label_encoder = pickle.load(f)
                print(f"Label encoder loaded from {encoder_path}")
            except Exception as e:
                print(f"Error loading label encoder: {str(e)}")
                self._init_default_label_encoder()
        else:
            print(f"Label encoder file not found at {encoder_path}, using default")
            self._init_default_label_encoder()
        
        self.model.eval()

    def predict(self, features):
        if self.label_encoder is None:
            print("Warning: No label encoder found. Initializing default label encoder.")
            self._init_default_label_encoder()
            
        self.model.eval()
        with torch.no_grad():
            # Handle both single sample and batch inputs
            if isinstance(features, np.ndarray) and features.ndim == 1:
                # If a single sample is provided (1D array), reshape it to 2D
                features = features.reshape(1, -1)
            
            features = torch.FloatTensor(features).to(self.device)
            presence_out, pose_out = self.model(features)
            
            # Handle prediction outputs correctly
            if isinstance(presence_out, torch.Tensor) and presence_out.ndim == 0:
                # If scalar, convert to list
                presence_pred = [(presence_out > 0.5).float().item()]
            else:
                presence_pred = (presence_out > 0.5).float().cpu().numpy()
                
            pose_pred = torch.argmax(pose_out, dim=1)
            try:
                pose_class = self.label_encoder.inverse_transform(pose_pred.cpu().numpy())
            except Exception as e:
                print(f"Error during pose class transformation: {str(e)}")
                pose_class = np.array(["unknown"] * len(pose_pred))
            
            return presence_pred, pose_class

if __name__ == "__main__":
    # Example usage
    input_size = 256  # Number of CSI subcarriers
    trainer = ModelTrainer(input_size)
    
    # Check if necessary directories exist
    os.makedirs('data/train_data', exist_ok=True)
    os.makedirs('data/test_data', exist_ok=True)
    os.makedirs('backend/model/saved_models', exist_ok=True)
    
    # Check if data files exist
    train_csv = 'data/train_data/wifi_csi_train.csv'
    test_csv = 'data/test_data/wifi_csi_test.csv'
    
    if os.path.exists(train_csv) and os.path.exists(test_csv):
        print("Training data found. Starting training...")
        # Train the model
        trainer.train(
            train_csv=train_csv,
            valid_csv=test_csv,
            num_epochs=50,  # Reduced for demonstration
            batch_size=32
        )
        print("Training completed.")
        
        # Test on a single sample for demonstration
        print("\nTesting on a single sample:")
        df = pd.read_csv(test_csv)
        csi_columns = [col for col in df.columns if col.startswith('csi_')]
        features = df[csi_columns].values[0]  # Take the first sample
        
        presence_pred, pose_class = trainer.predict(features)
        print(f"True pose: {df['pose_class'].iloc[0]}")
        print(f"Predicted pose: {pose_class[0]}")
        print(f"Human presence: {'Yes' if presence_pred[0] > 0.5 else 'No'}")
    else:
        print("Training data not found. Please run the data generation script first.")