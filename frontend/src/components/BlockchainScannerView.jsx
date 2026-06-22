import React, { useState } from 'react';
import { MdOutlineGpsFixed } from 'react-icons/md';

const BlockchainScannerView = () => {
  const [network, setNetwork] = useState('Ethereum');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const networks = ['Ethereum', 'Binance Smart Chain', 'Solana', 'Polygon', 'Arbitrum'];

  const handleScan = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`http://localhost:8000/api/blockchain-scan/${network}`);
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
      <div className="p-5 border-b border-gray-800 bg-primary/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MdOutlineGpsFixed className="text-primary text-2xl" />
          <h2 className="text-xl font-bold tracking-wider text-primary">NETWORK SCANNER</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex gap-4 mb-8">
          <select 
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="flex-1 bg-black/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            {networks.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button 
            onClick={handleScan}
            disabled={loading}
            className="px-6 py-2.5 bg-primary/20 text-primary border border-primary/50 rounded-lg font-bold hover:bg-primary hover:text-black transition-all disabled:opacity-50 min-w-[150px]"
          >
            {loading ? 'SCANNING...' : 'INITIATE SCAN'}
          </button>
        </div>

        {data && (
          <div className="animate-in fade-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Network Threat Intelligence</h3>
              <div className={`px-4 py-1 rounded-full text-sm font-bold border ${data.threat_level === 'Critical' ? 'text-danger border-danger bg-danger/20' : data.threat_level === 'High' ? 'text-orange-500 border-orange-500 bg-orange-500/20' : 'text-safe border-safe bg-safe/20'}`}>
                Threat Level: {data.threat_level}
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
            <MdOutlineGpsFixed className="text-6xl mb-4 opacity-20" />
            <p>Select a network and initiate a deep mempool scan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainScannerView;
