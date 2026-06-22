import React from 'react';
import { motion } from 'framer-motion';

const StatCards = ({ status }) => {
  const cards = [
    { 
      title: 'System Status', 
      value: status?.status || 'OFFLINE', 
      color: status?.status === 'ONLINE' ? 'text-safe' : 'text-danger',
      glow: status?.status === 'ONLINE' ? 'shadow-[0_0_15px_rgba(0,255,102,0.2)] border-safe/30' : 'shadow-[0_0_15px_rgba(255,42,42,0.2)] border-danger/30'
    },
    { 
      title: 'Transactions Scanned', 
      value: (status?.transactions_scanned || 0).toLocaleString(), 
      color: 'text-primary',
      glow: 'shadow-[0_0_15px_rgba(0,229,255,0.2)] border-primary/30'
    },
    { 
      title: 'Fraud Alerts', 
      value: status?.fraud_alerts || 0, 
      color: 'text-danger',
      glow: 'shadow-[0_0_15px_rgba(255,42,42,0.2)] border-danger/30'
    },
    { 
      title: 'Risk Score', 
      value: `${status?.overall_risk_score || 0}/100`, 
      color: 'text-secondary',
      glow: 'shadow-[0_0_15px_rgba(176,38,255,0.2)] border-secondary/30'
    },
    { 
      title: 'Active AI Agents', 
      value: status?.active_agents || 0, 
      color: 'text-white',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.1)] border-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`glass-card p-5 border ${card.glow}`}
        >
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wider">{card.title}</h3>
          <p className={`text-3xl font-bold ${card.color} ${card.color !== 'text-white' ? (card.color === 'text-safe' ? 'text-shadow-[0_0_10px_#00FF66]' : card.color === 'text-danger' ? 'neon-text-danger' : card.color === 'text-primary' ? 'neon-text' : 'text-shadow-[0_0_10px_#B026FF]') : ''}`}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
