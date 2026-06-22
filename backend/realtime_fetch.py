import requests
import random
import time
from datetime import datetime

BINANCE_TICKER_URL = "https://api.binance.com/api/v3/ticker/price"

# List of common crypto symbols to monitor
SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "ADAUSDT", "XRPUSDT"]

def fetch_crypto_prices():
    """Fetches real-time prices from Binance API."""
    try:
        response = requests.get(BINANCE_TICKER_URL, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # Filter for our symbols of interest
        prices = {item['symbol']: float(item['price']) for item in data if item['symbol'] in SYMBOLS}
        return prices
    except Exception as e:
        print(f"Error fetching Binance data: {e}")
        return None

def generate_live_transaction(prices):
    """
    Generates a simulated blockchain transaction using live crypto prices.
    This creates realistic looking transaction amounts.
    """
    if not prices:
        # Fallback if API fails
        prices = {"BTCUSDT": 60000.0, "ETHUSDT": 3000.0, "SOLUSDT": 150.0}
        
    symbol = random.choice(list(prices.keys()))
    price = prices[symbol]
    
    # Simulate an amount (e.g., 0.01 to 5.0 units of the crypto)
    units = random.uniform(0.01, 5.0)
    
    # Introduce occasional spikes for fraud detection testing
    if random.random() < 0.1: # 10% chance of a massive transaction
        units *= random.uniform(10, 100)
        
    usd_amount = units * price
    
    # Generate mock wallet address
    hex_chars = "0123456789abcdef"
    wallet_address = "0x" + "".join(random.choice(hex_chars) for _ in range(40))
    
    # Generate random frequency and wallet age to feed the ML model
    frequency = random.randint(1, 50)
    wallet_age = random.randint(1, 365)
    
    # If massive amount, make it seem more like fraud (high freq, low age)
    if usd_amount > 50000:
        frequency = random.randint(20, 100)
        wallet_age = random.randint(1, 10)
        
    return {
        "wallet_address": wallet_address,
        "network": symbol.replace("USDT", ""),
        "amount_usd": round(usd_amount, 2),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "frequency_last_24h": frequency,
        "wallet_age_days": wallet_age
    }

if __name__ == "__main__":
    prices = fetch_crypto_prices()
    print("Live Prices:", prices)
    print("Generated TX:", generate_live_transaction(prices))
