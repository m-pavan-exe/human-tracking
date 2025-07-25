# human-tracking
This application uses WiFi Channel State Information (CSI) data to detect human presence and pose, visualizing the results with a skeleton visualization.


# WiFi-Powered Human Presence & Pose Detection App

This application uses WiFi Channel State Information (CSI) data to detect human presence and pose, visualizing the results with a skeleton visualization.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

#### Generate Data & Train Model
To generate synthetic data and train the LSTM model, run:
```bash
python run_pipeline.py
```

This will:
- Generate synthetic WiFi CSI data (train and test sets)
- Create individual test samples for frontend testing
- Train the LSTM model
- Test the model with the generated samples

#### Start Backend
To start the Flask backend, run:
```bash
python start_backend.py
```

#### Start Frontend
To start the React frontend, run:
```bash
cd frontend
npm start
```

Then open your browser to `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── app.py                 # Flask application
│   ├── model/                 # Model definitions
│       ├── lstm_model.py      # LSTM model implementation
│       ├── saved_models/      # Saved model weights

```

## API Endpoints

- `POST /api/predict`: Upload a CSV file with WiFi CSI data and get predictions
- `GET /api/health`: Check if the backend is running

## Interface

The frontend includes:
- Home page with project overview
- Prediction Tool for uploading CSI data and viewing results
- About page with project information
- Responsive design with collapsible sidebar

