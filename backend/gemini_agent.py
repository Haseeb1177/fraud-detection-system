import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

# Create the model instance
# Using gemini-flash-latest for fast reasoning
model = genai.GenerativeModel('gemini-flash-latest')

def generate_fraud_explanation(transaction_data):
    """
    Asks the Gemini AI Agent to provide a brief, professional explanation
    for why a transaction was flagged, and what action to take.
    """
    if not API_KEY:
        return "AI Agent offline: Missing API Key."

    prompt = f"""
    You are an expert AI cybersecurity agent monitoring a Web3 blockchain network.
    Analyze the following transaction data and provide a brief (1-2 sentences) 
    explanation of why it might be suspicious and a recommended action.
    Keep the tone professional, futuristic, and urgent if the risk is high.
    
    Transaction Data:
    - Amount: ${transaction_data.get('amount')}
    - Risk Level: {transaction_data.get('risk_level')}
    - Fraud Probability: {transaction_data.get('fraud_probability') * 100:.1f}%
    - Wallet Age: {transaction_data.get('wallet_age_days')} days
    - 24h TX Frequency: {transaction_data.get('frequency_last_24h')}
    
    Explanation and Action:
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "AI Agent encountered an error analyzing this transaction."

def generate_force_scan_report(transaction_data):
    """
    Generates a deep, multi-paragraph analysis report for a Force Scan.
    """
    if not API_KEY:
        return "AI Agent offline: Missing API Key. Cannot perform FORCE SCAN."

    prompt = f"""
    You are an elite AI cybersecurity auditor. Perform a deep 'FORCE SCAN' on this blockchain transaction.
    Provide a detailed, 3-paragraph report covering:
    1. Anomaly Detection: What specific metrics are abnormal?
    2. Threat Intelligence: What known attack vector does this resemble?
    3. Action Plan: Step-by-step mitigation strategy.
    
    Transaction Data:
    - Wallet: {transaction_data.get('wallet_address')}
    - Amount: ${transaction_data.get('amount_usd')}
    - Risk Level: {transaction_data.get('risk_level')}
    - Fraud Probability: {transaction_data.get('fraud_probability', 0) * 100:.1f}%
    - Wallet Age: {transaction_data.get('wallet_age_days')} days
    - 24h TX Frequency: {transaction_data.get('frequency_last_24h')}
    - Network: {transaction_data.get('network')}
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error in Force Scan: {e}")
        return "AI Agent encountered an error during FORCE SCAN."

def simulate_agent_orchestration(transaction_data):
    """
    Simulates a communication log between three distinct AI agents.
    Returns a list of dictionaries with agent messages.
    """
    if not API_KEY:
        return [{"agent": "System", "message": "Agents offline: API Key missing.", "time": "Now"}]
        
    prompt = f"""
    Simulate a brief communication log between three AI agents analyzing this transaction:
    - RiskScoringAgent (analyzes numbers)
    - InvestigatorAgent (looks for patterns)
    - DecisionEngine (makes the final call)
    
    Transaction Data:
    - Amount: ${transaction_data.get('amount_usd')}
    - Risk Level: {transaction_data.get('risk_level')}
    
    Return ONLY a valid JSON array of objects. Each object must have:
    - "agent": name of the agent
    - "message": what they said (1 short sentence)
    - "time": a timestamp string like "10:45:02 AM"
    
    Example:
    [
      {{"agent": "RiskScoringAgent", "message": "High volume detected.", "time": "10:45:00 AM"}},
      {{"agent": "InvestigatorAgent", "message": "Matches known pattern.", "time": "10:45:01 AM"}}
    ]
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Use regex to find the JSON array in case Gemini adds conversational text
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            text = match.group(0)
            
        logs = json.loads(text)
        return logs
    except Exception as e:
        print(f"Gemini API Error in Orchestration: {e}")
        return [{"agent": "System", "message": f"Agent communication failed: {str(e)}", "time": "Now"}]

def generate_wallet_analysis(wallet_address):
    """
    Deep dive into a specific wallet.
    """
    if not API_KEY:
        return "AI Agent offline: Missing API Key."

    prompt = f"""
    You are an elite AI cybersecurity auditor. Perform a detailed profile analysis on the crypto wallet: {wallet_address}.
    (Simulate the analysis as if you have full access to its blockchain history).
    Provide a 2-paragraph summary detailing:
    1. Overall Risk Profile (Safe, Suspicious, Malicious).
    2. Primary activity patterns (e.g., DeFi degens, mixer usage, cold storage).
    3. Final recommendation on interaction.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Wallet analysis failed: {str(e)}"

def generate_network_scan(network_name):
    """
    Perform a high-level scan of a specific blockchain network.
    """
    if not API_KEY:
        return "AI Agent offline: Missing API Key."

    prompt = f"""
    You are an elite AI cybersecurity auditor. Perform a real-time simulated security audit of the {network_name} blockchain network.
    Provide a 2-paragraph summary detailing:
    1. Current network health and congestion.
    2. Any active smart contract vulnerabilities or ongoing large-scale exploits detected in the mempool.
    3. Overall network threat level (Low, Medium, High, Critical).
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Network scan failed: {str(e)}"

if __name__ == "__main__":
    # Test the agent
    test_tx = {
        'amount': 8500,
        'risk_level': 'HIGH RISK',
        'fraud_probability': 0.85,
        'wallet_age_days': 2,
        'frequency_last_24h': 45
    }
    print(generate_fraud_explanation(test_tx))
