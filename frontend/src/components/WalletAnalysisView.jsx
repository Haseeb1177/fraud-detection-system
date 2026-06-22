import React, { useState } from 'react';
import { MdAccountBalanceWallet, MdSearch } from 'react-icons/md';

const WalletAnalysisView = () => {
  const [wallet, setWallet] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/wallet-analysis/${wallet}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[600px]">
      <div className="p-5 border-b border-gray-800 bg-secondary/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MdAccountBalanceWallet className="text-secondary text-2xl" />
          <h2 className="text-xl font-bold tracking-wider text-secondary">WALLET AI ANALYSIS</h2>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-3 text-gray-400 text-xl" />
            <input 
              type="text" 
              placeholder="Enter Wallet Address (e.g. 0x...)" 
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2.5 bg-secondary/20 text-secondary border border-secondary/50 rounded-lg font-bold hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? 'ANALYZING...' : 'ANALYZE'}
          </button>
        </form>

        {data && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Analysis Profile</h3>
              <div className={`px-4 py-1 rounded-full text-sm font-bold border ${data.risk_score > 75 ? 'text-danger border-danger bg-danger/20' : data.risk_score > 40 ? 'text-yellow-400 border-yellow-400 bg-yellow-400/20' : 'text-safe border-safe bg-safe/20'}`}>
                Risk Score: {data.risk_score}/100
              </div>
            </div>
            <div className="p-4 bg-black/40 border border-gray-800 rounded-lg space-y-4">
              {data.report.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-sm text-gray-300 leading-relaxed">
                  {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              ))}
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12">
            <MdAccountBalanceWallet className="text-6xl mb-4 opacity-20" />
            <p>Enter a wallet address to generate an AI risk profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletAnalysisView;
