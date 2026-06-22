import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import FraudMonitor from './components/FraudMonitor';
import AIAgentPanel from './components/AIAgentPanel';
import Charts from './components/Charts';

import DashboardView from './components/DashboardView';
import BlockchainScannerView from './components/BlockchainScannerView';
import WalletAnalysisView from './components/WalletAnalysisView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Fraud Monitor');
  const [isScanning, setIsScanning] = useState(false);
  const [forceScanData, setForceScanData] = useState(null);

  // Initial load
  useEffect(() => {
    fetchStatus();
    fetchRecentTxs();
  }, []);

  // Real-time polling
  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        pollNewTxs();
        fetchStatus();
      }, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/system-status');
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError("Cannot connect to backend server.");
      setStatus({ status: 'OFFLINE' });
    }
  };

  const fetchRecentTxs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/recent-transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const pollNewTxs = async () => {
    try {
      // Fetch 1-3 new transactions
      const count = Math.floor(Math.random() * 3) + 1;
      const res = await fetch(`http://localhost:8000/api/poll-transactions?count=${count}`);
      const newTxs = await res.json();
      
      setTransactions(prev => {
        const combined = [...newTxs, ...prev];
        return combined.slice(0, 50); // Keep last 50
      });
    } catch (err) {
      console.error(err);
      setIsMonitoring(false);
    }
  };

  const handleForceScan = async () => {
    setIsScanning(true);
    setForceScanData(null);
    try {
      const res = await fetch('http://localhost:8000/api/force-scan', { method: 'POST' });
      const data = await res.json();
      setForceScanData(data);
    } catch (err) {
      console.error(err);
      setError("Force Scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-white font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-64 p-8 h-screen overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-2 shadow-text">
              GLOBAL INTELLIGENCE <span className="text-primary neon-text">NETWORK</span>
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              Agentic AI Real-time Blockchain Analysis
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-6 py-2 rounded-lg font-bold tracking-wider transition-all duration-300 ${
                isMonitoring 
                  ? 'bg-danger/20 text-danger border border-danger/50 shadow-[0_0_15px_rgba(255,42,42,0.4)]' 
                  : 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:bg-primary hover:text-black'
              }`}
            >
              {isMonitoring ? 'STOP MONITORING' : 'START MONITORING'}
            </button>
            <button 
              onClick={handleForceScan}
              disabled={isScanning}
              className={`px-6 py-2 rounded-lg font-bold tracking-wider transition-all duration-300 ${
                isScanning ? 'bg-secondary/50 text-white cursor-wait animate-pulse' : 'bg-[rgba(20,20,30,0.8)] text-secondary border border-secondary/50 hover:bg-secondary hover:text-white shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)]'
              }`}
            >
              {isScanning ? 'SCANNING...' : 'FORCE SCAN'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/20 border border-danger rounded-lg text-danger flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-danger animate-ping"></div>
            SYSTEM ALERT: {error} Ensure backend API is running on port 8000.
          </div>
        )}

        {activeTab === 'Dashboard' && (
          <>
            <StatCards status={status} />
            <Charts transactions={transactions} />
            <DashboardView status={status} transactions={transactions} />
          </>
        )}

        {activeTab === 'Fraud Monitor' && (
          <>
            <StatCards status={status} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
              <div className="lg:col-span-2">
                <FraudMonitor transactions={transactions} />
              </div>
              <div className="lg:col-span-1">
                <AIAgentPanel transactions={transactions} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'AI Agent' && (
          <>
            <StatCards status={status} />
            <AIAgentPanel transactions={transactions} />
          </>
        )}

        {activeTab === 'Blockchain Scanner' && <BlockchainScannerView />}
        {activeTab === 'Wallet Analysis' && <WalletAnalysisView />}
        {activeTab === 'Alerts' && <AlertsView />}
        {activeTab === 'Reports' && <ReportsView />}
        {activeTab === 'Settings' && <SettingsView />}
      </div>

      {/* FORCE SCAN MODAL */}
      {forceScanData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-[800px] max-w-full max-h-[90vh] flex flex-col border-secondary shadow-[0_0_50px_rgba(176,38,255,0.3)] animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-800 bg-secondary/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-widest text-secondary text-shadow-[0_0_15px_#B026FF] flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-danger animate-ping"></span>
                  DEEP SYSTEM SCAN RESULTS
                </h2>
                <p className="text-gray-400 text-sm mt-1">Target Wallet: <span className="font-mono text-white">{forceScanData.transaction.wallet_address}</span></p>
              </div>
              <button 
                onClick={() => setForceScanData(null)}
                className="text-gray-400 hover:text-white text-3xl font-light"
              >&times;</button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-3 rounded bg-black/40 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">NETWORK</p>
                  <p className="font-bold text-primary">{forceScanData.transaction.network}</p>
                </div>
                <div className="p-3 rounded bg-black/40 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">AMOUNT</p>
                  <p className="font-bold font-mono text-white">${forceScanData.transaction.amount_usd.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded bg-black/40 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">FRAUD PROB</p>
                  <p className="font-bold text-danger">{(forceScanData.transaction.fraud_probability * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded bg-black/40 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">RISK LEVEL</p>
                  <p className="font-bold text-danger">{forceScanData.transaction.risk_level}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary tracking-wider border-b border-gray-800 pb-2">AI AGENT ANALYSIS REPORT</h3>
                {forceScanData.report.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-300 leading-relaxed text-sm">
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')} {/* Strip simple markdown for display */}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-black/40">
               <button className="px-6 py-2 rounded font-bold text-sm bg-danger/20 text-danger border border-danger/50 hover:bg-danger hover:text-white transition-colors">
                 QUARANTINE WALLET
               </button>
               <button 
                onClick={() => setForceScanData(null)}
                className="px-6 py-2 rounded font-bold text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
               >
                 CLOSE
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
