import React from 'react';
import { 
  MdDashboard, 
  MdSecurity, 
  MdSmartToy, 
  MdAccountBalanceWallet,
  MdNotificationsActive,
  MdBarChart,
  MdSettings,
  MdOutlineGpsFixed
} from 'react-icons/md';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard /> },
    { name: 'Fraud Monitor', icon: <MdSecurity /> },
    { name: 'AI Agent', icon: <MdSmartToy /> },
    { name: 'Blockchain Scanner', icon: <MdOutlineGpsFixed /> },
    { name: 'Wallet Analysis', icon: <MdAccountBalanceWallet /> },
    { name: 'Alerts', icon: <MdNotificationsActive /> },
    { name: 'Reports', icon: <MdBarChart /> },
    { name: 'Settings', icon: <MdSettings /> },
  ];

  return (
    <div className="w-64 h-screen glass-card flex flex-col p-6 fixed left-0 top-0 border-r border-gray-800 rounded-none z-10">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center neon-border shadow-lg">
          <MdSecurity className="text-black text-xl" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">
          AGENTIC<span className="text-primary neon-text">AI</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === item.name 
                ? 'bg-gradient-to-r from-[rgba(0,229,255,0.1)] to-transparent border-l-4 border-primary text-primary' 
                : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <button className="w-full py-3 bg-[rgba(176,38,255,0.1)] text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:shadow-[0_0_20px_rgba(176,38,255,0.5)]">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
