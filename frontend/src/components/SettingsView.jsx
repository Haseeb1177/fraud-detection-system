import React, { useState, useEffect } from 'react';
import { MdSettings } from 'react-icons/md';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    risk_threshold: 75,
    auto_quarantine: false,
    strictness_level: 'Medium'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[600px]">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MdSettings className="text-gray-400 text-2xl" />
          <h2 className="text-xl font-bold tracking-wider text-white">SYSTEM CONFIGURATION</h2>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSave} className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">ML Risk Threshold ({settings.risk_threshold}%)</label>
            <input 
              type="range" 
              min="50" max="99" 
              value={settings.risk_threshold}
              onChange={e => setSettings({...settings, risk_threshold: parseInt(e.target.value)})}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Transactions scoring above this will be flagged as HIGH RISK.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">AI Strictness Level</label>
            <select 
              value={settings.strictness_level}
              onChange={e => setSettings({...settings, strictness_level: e.target.value})}
              className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-gray-500"
            >
              <option>Low (Forgiving)</option>
              <option>Medium (Balanced)</option>
              <option>High (Paranoid)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="quarantine"
              checked={settings.auto_quarantine}
              onChange={e => setSettings({...settings, auto_quarantine: e.target.checked})}
              className="w-5 h-5 accent-danger"
            />
            <label htmlFor="quarantine" className="text-sm font-bold text-gray-300">Enable Autonomous Wallet Quarantine</label>
          </div>

          <button 
            type="submit"
            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            {saved ? 'SAVED!' : 'APPLY CONFIGURATION'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
