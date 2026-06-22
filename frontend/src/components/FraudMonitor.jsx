import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FraudMonitor = ({ transactions }) => {
  const getRiskColor = (level) => {
    switch(level) {
      case 'SAFE': return 'text-safe border-safe bg-safe/10';
      case 'MEDIUM RISK': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'HIGH RISK': return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'FRAUD DETECTED': return 'text-danger border-danger bg-danger/20 animate-pulse';
      default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="glass-card flex-1 flex flex-col h-[600px]">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[rgba(0,0,0,0.2)]">
        <h2 className="text-xl font-bold tracking-wider">LIVE TRANSACTION MONITOR</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-safe animate-ping"></div>
          <span className="text-safe text-sm font-medium">SCANNING NETWORK...</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        <AnimatePresence>
          {transactions.map((tx, index) => (
            <motion.div
              key={`${tx.wallet_address}-${tx.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-gray-800 hover:bg-[rgba(255,255,255,0.06)] transition-all flex items-center justify-between"
            >
              <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                <div className="col-span-1">
                  <p className="text-xs text-gray-500 mb-1">NETWORK</p>
                  <p className="font-semibold text-primary">{tx.network}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">WALLET</p>
                  <p className="font-mono text-sm truncate pr-4" title={tx.wallet_address}>
                    {tx.wallet_address}
                  </p>
                </div>
                
                <div className="col-span-1">
                  <p className="text-xs text-gray-500 mb-1">AMOUNT</p>
                  <p className="font-mono">${tx.amount_usd.toLocaleString()}</p>
                </div>
                
                <div className="col-span-1 flex justify-end">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(tx.risk_level)}`}>
                    {tx.risk_level}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {transactions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Awaiting blockchain data...
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudMonitor;
