import React, { useState, useEffect } from 'react';
import { MdNotificationsActive } from 'react-icons/md';

const AlertsView = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/alerts');
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
    // Poll every 5 seconds
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card flex flex-col h-[600px]">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-danger/5">
        <div className="flex items-center gap-3">
          <MdNotificationsActive className="text-danger text-2xl animate-pulse" />
          <h2 className="text-xl font-bold tracking-wider text-danger">SYSTEM ALERTS</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading && <p className="text-gray-500 text-center mt-10">Loading alerts...</p>}
        {!loading && alerts.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No active alerts. System is secure.</p>
        )}
        <div className="space-y-3">
          {alerts.map((tx, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[rgba(255,42,42,0.05)] border border-danger/30 hover:border-danger transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-danger">{tx.risk_level}</span>
                <span className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-300 font-mono mb-2">Wallet: {tx.wallet_address}</p>
              <p className="text-xs text-gray-400 italic">"{tx.ai_explanation}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsView;
