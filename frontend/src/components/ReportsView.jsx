import React, { useState, useEffect } from 'react';
import { MdBarChart, MdDashboard } from 'react-icons/md';

const ReportsView = () => {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="glass-card flex flex-col h-[600px]">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-secondary/5">
        <div className="flex items-center gap-3">
          <MdBarChart className="text-secondary text-2xl" />
          <h2 className="text-xl font-bold tracking-wider text-secondary">GLOBAL INTELLIGENCE REPORTS</h2>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {!reports ? (
           <p className="text-gray-500 text-center mt-10">Compiling intelligence reports...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">TOTAL NETWORK VOLUME (SCANNED)</p>
                <p className="text-2xl font-bold font-mono text-white">${reports.total_volume_usd.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-black/40 border border-danger/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">FRAUD VOLUME DETECTED</p>
                <p className="text-2xl font-bold font-mono text-danger">${reports.fraud_volume_usd.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">TRANSACTIONS PROCESSED</p>
                <p className="text-2xl font-bold text-primary">{reports.total_transactions}</p>
              </div>
              <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">MALICIOUS TRANSACTIONS</p>
                <p className="text-2xl font-bold text-danger">{reports.fraud_detected}</p>
              </div>
            </div>

            <div className="p-4 border border-gray-800 rounded-lg bg-black/20">
              <h3 className="font-bold mb-2">Automated Compliance Report</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The AI Agentic system has successfully monitored and scored {reports.total_transactions} transactions across the network. 
                Currently, {reports.fraud_detected} transactions have breached the configured risk thresholds, representing a total of ${reports.fraud_volume_usd.toLocaleString()} in potential illicit activity. 
                All flagged wallets have been submitted to the autonomous investigation pipeline.
              </p>
              <button className="mt-4 px-4 py-2 border border-gray-600 rounded text-xs font-bold hover:bg-gray-800 transition-colors">
                DOWNLOAD PDF (MOCK)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
