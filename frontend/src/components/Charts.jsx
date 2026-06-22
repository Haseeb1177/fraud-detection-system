import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const Charts = ({ transactions }) => {
  // Process data for charts
  const timeData = transactions.slice(0, 20).reverse().map((tx, i) => ({
    time: new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
    amount: tx.amount_usd,
    risk: tx.fraud_probability * 100
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-gray-700 bg-[rgba(10,10,15,0.9)]">
          <p className="text-gray-300 text-xs mb-1">{label}</p>
          <p className="text-primary font-bold text-sm">
            Amount: ${(payload[0].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="glass-card p-5 h-[300px]">
        <h3 className="text-sm text-gray-400 mb-4 tracking-wider">NETWORK TRANSACTION VOLUME (USD)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="time" stroke="#666" fontSize={10} tickMargin={10} />
            <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#00E5FF" 
              strokeWidth={2}
              dot={{ fill: '#00E5FF', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-5 h-[300px]">
        <h3 className="text-sm text-gray-400 mb-4 tracking-wider">FRAUD PROBABILITY TIMELINE</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="time" stroke="#666" fontSize={10} tickMargin={10} />
            <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', border: '1px solid #333' }}
              itemStyle={{ color: '#FF2A2A', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="risk" 
              fill="#FF2A2A" 
              radius={[4, 4, 0, 0]}
              // Dynamic color based on value is possible with Cell, but this is simpler
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
