import React from 'react';
import { MdDashboard, MdSecurity, MdTrendingUp } from 'react-icons/md';

const DashboardView = ({ status, transactions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="glass-card p-6 border-primary/30">
        <div className="flex items-center gap-3 mb-4">
          <MdTrendingUp className="text-primary text-2xl" />
          <h3 className="font-bold tracking-wider">SYSTEM EFFICIENCY</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          The AI system is currently operating at optimal capacity. Transactions are being scanned and scored in near real-time.
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Scan Latency</span>
              <span className="text-safe">42ms</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-safe h-1.5 rounded-full w-[15%]"></div></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Model Confidence</span>
              <span className="text-primary">98.5%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full w-[98%]"></div></div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 border-secondary/30">
        <div className="flex items-center gap-3 mb-4">
          <MdSecurity className="text-secondary text-2xl" />
          <h3 className="font-bold tracking-wider">THREAT LANDSCAPE</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Overall network threat level based on recent flagged transactions and AI agent orchestration.
        </p>
        <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800">
           <span className="font-bold">CURRENT STATUS</span>
           <span className={`px-3 py-1 rounded font-bold text-sm ${status?.overall_risk_score > 50 ? 'bg-danger/20 text-danger border border-danger/50' : 'bg-safe/20 text-safe border border-safe/50'}`}>
             {status?.overall_risk_score > 50 ? 'ELEVATED RISK' : 'SECURE'}
           </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
