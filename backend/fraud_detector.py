import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

DATASET_DIR = "../dataset"
DATASET_PATH = os.path.join(DATASET_DIR, "fraudTrain.csv")
MODEL_PATH = "fraud_rf_model.pkl"
SCALER_PATH = "fraud_scaler.pkl"

def generate_synthetic_dataset(path):
    """Generates a synthetic dataset for testing if the real one is missing."""
    print("Generating synthetic fraudTrain.csv...")
    os.makedirs(DATASET_DIR, exist_ok=True)
    np.random.seed(42)
    n_samples = 5000
    
    # Features: amount, is_crypto, frequency_last_24h, wallet_age_days
    amounts = np.random.exponential(scale=500, size=n_samples)
    frequencies = np.random.poisson(lam=5, size=n_samples)
    wallet_ages = np.random.randint(1, 365, size=n_samples)
    
    # Create target (is_fraud) based on some rules with noise
    is_fraud = ((amounts > 2000) & (frequencies > 10)) | (amounts > 5000) | ((wallet_ages < 7) & (amounts > 1000))
    # Add noise
    noise = np.random.choice([True, False], size=n_samples, p=[0.05, 0.95])
    is_fraud = is_fraud ^ noise
    
    df = pd.DataFrame({
        'amount': amounts,
        'frequency_last_24h': frequencies,
        'wallet_age_days': wallet_ages,
        'is_fraud': is_fraud.astype(int)
    })
    
    df.to_csv(path, index=False)
    print(f"Synthetic dataset saved to {path}")

def train_model():
    if not os.path.exists(DATASET_PATH):
        generate_synthetic_dataset(DATASET_PATH)
        
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    
    # We expect columns like amount, frequency_last_24h, wallet_age_days. 
    # If using actual huggingface fraudTrain.csv, we would map columns here.
    # For simplicity, we just use the numeric features available in our synthetic data.
    features = ['amount', 'frequency_last_24h', 'wallet_age_days']
    if 'is_fraud' not in df.columns:
        # Fallback if the user's real dataset has a different target column name
        target_col = [col for col in df.columns if 'fraud' in col.lower()][0]
    else:
        target_col = 'is_fraud'
        
    X = df[features]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    print("Training RandomForest model...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print("Model trained and saved successfully.")

class FraudDetector:
    def __init__(self):
        if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
            train_model()
        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        
    def analyze_transaction(self, amount, frequency, wallet_age):
        """Analyzes a transaction and returns risk metrics."""
        features = np.array([[amount, frequency, wallet_age]])
        scaled_features = self.scaler.transform(features)
        
        prob = self.model.predict_proba(scaled_features)[0][1]
        
        risk_level = "SAFE"
        if prob > 0.8:
            risk_level = "FRAUD DETECTED"
        elif prob > 0.5:
            risk_level = "HIGH RISK"
        elif prob > 0.2:
            risk_level = "MEDIUM RISK"
            
        return {
            "fraud_probability": float(prob),
            "risk_level": risk_level,
            "decision": "Flagged for review" if prob > 0.5 else "Transaction allowed"
        }

if __name__ == "__main__":
    detector = FraudDetector()
    print("Test prediction:", detector.analyze_transaction(5500, 15, 2))
