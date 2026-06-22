from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from typing import List
import time

from fraud_detector import FraudDetector
from realtime_fetch import fetch_crypto_prices, generate_live_transaction
from gemini_agent import generate_fraud_explanation, simulate_agent_orchestration, generate_force_scan_report, generate_wallet_analysis, generate_network_scan

app = FastAPI(title="Agentic AI Fraud Detection API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the ML Model
detector = FraudDetector()

# Store recent transactions in memory (like a mini-database)
recent_transactions = []
MAX_TX_HISTORY = 50

# In-memory settings
system_settings = {
    "risk_threshold": 75,
    "auto_quarantine": False,
    "strictness_level": "Medium"
}

# Cache prices to avoid hitting Binance API too often
cached_prices = {}
last_price_fetch = 0

def get_prices():
    global cached_prices, last_price_fetch
    now = time.time()
    if now - last_price_fetch > 10:  # Fetch every 10 seconds max
        prices = fetch_crypto_prices()
        if prices:
            cached_prices = prices
            last_price_fetch = now
    return cached_prices

def background_transaction_generator():
    """Simulates continuous incoming transactions."""
    pass # In a real app we might run this in a thread, but for this prototype 
         # we will generate them on-demand when the frontend polls to save resources.

@app.get("/api/system-status")
async def get_system_status():
    """Returns overall system stats."""
    fraud_count = sum(1 for tx in recent_transactions if tx['risk_level'] in ['HIGH RISK', 'FRAUD DETECTED'])
    return {
        "status": "ONLINE",
        "active_agents": 3,
        "transactions_scanned": len(recent_transactions) * 150, # Fake multiplier for visual effect
        "fraud_alerts": fraud_count,
        "overall_risk_score": round(min(100, (fraud_count / max(1, len(recent_transactions))) * 100 * 5), 1)
    }

@app.get("/api/poll-transactions")
async def poll_transactions(count: int = 2):
    """
    Frontend calls this every few seconds to get new transactions.
    It generates 'count' transactions, analyzes them, and adds to history.
    """
    prices = get_prices()
    new_txs = []
    
    for _ in range(count):
        # 1. Generate live transaction from Binance data
        raw_tx = generate_live_transaction(prices)
        
        # 2. Analyze with ML Model
        analysis = detector.analyze_transaction(
            raw_tx["amount_usd"], 
            raw_tx["frequency_last_24h"], 
            raw_tx["wallet_age_days"]
        )
        
        # 3. Combine data
        tx_data = {**raw_tx, **analysis}
        
        # 4. If high risk, invoke Gemini AI Agent for reasoning
        if tx_data["risk_level"] in ["HIGH RISK", "FRAUD DETECTED"]:
            explanation = generate_fraud_explanation(tx_data)
            tx_data["ai_explanation"] = explanation
            tx_data["orchestration_logs"] = simulate_agent_orchestration(tx_data)
        else:
            tx_data["ai_explanation"] = "Standard transaction pattern. No anomalies detected."
            tx_data["orchestration_logs"] = []
            
        new_txs.append(tx_data)
        
        # Add to history
        recent_transactions.insert(0, tx_data)
        if len(recent_transactions) > MAX_TX_HISTORY:
            recent_transactions.pop()
            
    return new_txs

@app.get("/api/recent-transactions")
async def get_recent_transactions():
    """Returns the history of recent transactions."""
    return recent_transactions

@app.post("/api/force-scan")
async def force_scan():
    """Generates a new high-risk transaction and performs a deep Force Scan on it."""
    prices = get_prices()
    raw_tx = generate_live_transaction(prices)
    # Force it to look high risk for the scan
    raw_tx["amount_usd"] = max(100000, raw_tx["amount_usd"] * 50) 
    raw_tx["frequency_last_24h"] = max(100, raw_tx["frequency_last_24h"] * 10)
    raw_tx["wallet_age_days"] = 0
    
    analysis = detector.analyze_transaction(
        raw_tx["amount_usd"], 
        raw_tx["frequency_last_24h"], 
        raw_tx["wallet_age_days"]
    )
    
    tx_data = {**raw_tx, **analysis}
    report = generate_force_scan_report(tx_data)
    
    return {
        "transaction": tx_data,
        "report": report
    }

@app.get("/api/alerts")
async def get_alerts():
    """Returns a history of flagged alerts."""
    return [tx for tx in recent_transactions if tx.get("risk_level") in ["HIGH RISK", "FRAUD DETECTED"]]

@app.get("/api/reports")
async def get_reports():
    """Returns aggregated analytics data for the dashboard."""
    total_tx = len(recent_transactions)
    fraud_count = sum(1 for tx in recent_transactions if tx.get("risk_level") in ["HIGH RISK", "FRAUD DETECTED"])
    safe_count = total_tx - fraud_count
    
    total_volume = sum(tx.get("amount_usd", 0) for tx in recent_transactions)
    fraud_volume = sum(tx.get("amount_usd", 0) for tx in recent_transactions if tx.get("risk_level") in ["HIGH RISK", "FRAUD DETECTED"])
    
    return {
        "total_transactions": total_tx,
        "fraud_detected": fraud_count,
        "safe_transactions": safe_count,
        "total_volume_usd": total_volume,
        "fraud_volume_usd": fraud_volume
    }

@app.get("/api/settings")
async def get_settings():
    return system_settings

@app.post("/api/settings")
async def update_settings(settings: dict):
    global system_settings
    system_settings.update(settings)
    return {"status": "success", "settings": system_settings}

@app.get("/api/wallet-analysis/{wallet_address}")
async def wallet_analysis(wallet_address: str):
    """Triggers deep AI analysis on a specific wallet."""
    report = generate_wallet_analysis(wallet_address)
    # Give it a random risk score for UI
    import random
    risk_score = random.randint(10, 95)
    return {
        "wallet_address": wallet_address,
        "risk_score": risk_score,
        "report": report
    }

@app.get("/api/blockchain-scan/{network}")
async def blockchain_scan(network: str):
    """Triggers high-level AI scan of a network."""
    report = generate_network_scan(network)
    import random
    threat_level = random.choice(["Low", "Medium", "High", "Critical"])
    return {
        "network": network,
        "threat_level": threat_level,
        "report": report
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
