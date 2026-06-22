# Agentic AI Fraud Detection System

A futuristic, full-stack Web3 cybersecurity dashboard that leverages the Gemini API and a Machine Learning model to detect and analyze suspicious blockchain transactions in real-time.

## Features
- **Real-time Monitoring**: Simulates continuous transaction streams using live data from the Binance API.
- **Machine Learning**: Utilizes a `RandomForestClassifier` trained on synthetic transactional data to predict fraud probability and risk levels.
- **Agentic AI**: Integrates the Gemini API to provide intelligent, human-readable reasoning and actionable recommendations for high-risk transactions.
- **Futuristic UI**: A premium dark-mode dashboard built with React, Tailwind CSS, Framer Motion, and Recharts, featuring glassmorphism and neon accents.

## Setup Instructions

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python main.py
   ```
   *The backend will run on `http://localhost:8000`. On the first run, it will automatically generate a synthetic dataset and train the ML model.*

### 2. Frontend Setup

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Usage
- Click the **START MONITORING** button in the dashboard to begin fetching and analyzing real-time transactions.
- Watch as transactions populate the **Live Transaction Monitor**.
- Any transactions flagged as `HIGH RISK` or `FRAUD DETECTED` will trigger the Gemini AI Agent, which will display its reasoning in the **AI Reasoning Agent** panel on the right.
