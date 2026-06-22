import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSmartToy, MdForum, MdWarning } from 'react-icons/md';

const AIAgentPanel = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'orchestration'

  // Filter for high risk to show AI reasoning
  const flaggedTxs = transactions.filter(tx => 
    tx.risk_level === 'HIGH RISK' || tx.risk_level === 'FRAUD DETECTED'
  );

  return (
    <div className="glass-card flex flex-col h-[600px] border-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>
      
      <div className="p-4 border-b border-gray-800 bg-[rgba(176,38,255,0.05)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MdSmartToy className="text-secondary text-2xl animate-pulse" />
          <h2 className="text-lg font-bold tracking-wider text-white text-shadow-[0_0_10px_#B026FF]">AI ORCHESTRATOR</h2>
        </div>
        <div className="flex bg-black/40 rounded-lg p-1 border border-gray-800">
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ${activeTab === 'alerts' ? 'bg-secondary/20 text-secondary' : 'text-gray-500 hover:text-white'}`}
          >
            <MdWarning /> ALERTS
          </button>
          <button 
            onClick={() => setActiveTab('orchestration')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ${activeTab === 'orchestration' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-white'}`}
          >
            <MdForum /> LOGS
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'alerts' ? (
            <motion.div 
              key="alerts-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {flaggedTxs.map((tx, index) => (
                <div key={`alert-${index}`} className="p-4 rounded-lg bg-[rgba(20,20,30,0.8)] border border-danger/30 relative overflow-hidden group hover:border-danger transition-colors shadow-lg">
                  <div className="absolute top-0 left-0 w-1 h-full bg-danger shadow-[0_0_10px_#ff2a2a]"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-400 font-mono">Target: {tx.wallet_address.substring(0, 12)}...</span>
                    <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded border border-danger/50 shadow-[0_0_5px_#ff2a2a]">
                      Prob: {(tx.fraud_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-200 leading-relaxed italic mb-3 font-medium">
                    "{tx.ai_explanation}"
                  </p>
                  
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 py-1.5 bg-danger/10 text-danger border border-danger/50 rounded text-xs font-bold hover:bg-danger hover:text-white transition-all shadow-[0_0_10px_rgba(255,42,42,0.2)] hover:shadow-[0_0_15px_rgba(255,42,42,0.5)]">
                      FREEZE WALLET
                    </button>
                    <button className="flex-1 py-1.5 bg-gray-800 text-gray-300 border border-gray-700 rounded text-xs font-bold hover:bg-gray-700 hover:text-white transition-colors">
                      DISMISS
                    </button>
                  </div>
                </div>
              ))}
              {flaggedTxs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 py-10">
                  <MdSmartToy className="text-4xl mb-2" />
                  <p className="text-sm text-center">AI Agents idle.<br/>No high-risk activity detected.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="logs-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {flaggedTxs.flatMap((tx, txIndex) => 
                (tx.orchestration_logs || []).map((log, logIndex) => (
                  <div key={`log-${txIndex}-${logIndex}`} className="p-3 rounded border border-gray-800 bg-black/40 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${log.agent === 'RiskScoringAgent' ? 'text-primary' : log.agent === 'InvestigatorAgent' ? 'text-secondary' : log.agent === 'DecisionEngine' ? 'text-danger' : 'text-gray-400'}`}>
                        @{log.agent}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">{log.time || new Date().toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-mono">_ {log.message}</p>
                  </div>
                ))
              )}
              {flaggedTxs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 py-10">
                  <MdForum className="text-4xl mb-2" />
                  <p className="text-sm text-center">Orchestration Logs empty.<br/>Awaiting flagged transactions.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAgentPanel;
