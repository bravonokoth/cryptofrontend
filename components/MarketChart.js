import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function MarketChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('bar');

  useEffect(() => {
    fetch('/api/prices')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => setData(json.slice(0, 10)))
      .catch(err => setError(err.message));
  }, []);

  if (error) return (
    <div className="glass-card chart-container">
      <h2>Market Overview</h2>
      <div className="error-text" style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Chart data unavailable
      </div>
    </div>
  );

  const barData = data.map(c => ({
    name: c.symbol,
    'Market Cap ($B)': parseFloat((c.market_cap / 1e9).toFixed(1)),
  }));

  const pieData = data.slice(0, 7).map(c => ({
    name: c.symbol,
    value: parseFloat((c.market_cap / 1e9).toFixed(1)),
  }));

  const changeData = data.map(c => ({
    name: c.symbol,
    '24h Change (%)': parseFloat(Number(c.change_24h).toFixed(2)),
  }));

  return (
    <div className="glass-card chart-container">
      <div className="chart-header">
        <h2>Market Overview <span className="live-badge">LIVE</span></h2>
        <div className="chart-tabs">
          {['bar', 'pie', 'change'].map(type => (
            <button
              key={type}
              className={`chart-tab ${activeChart === type ? 'active' : ''}`}
              onClick={() => setActiveChart(type)}
            >
              {type === 'bar' ? 'Market Cap' : type === 'pie' ? 'Distribution' : '24h Change'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        {data.length === 0 ? (
          <div className="loading-card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading chart…
          </div>
        ) : activeChart === 'bar' ? (
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} unit="B" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Market Cap ($B)" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : activeChart === 'pie' ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`$${v}B`, 'Market Cap']} contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer>
            <BarChart data={changeData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="24h Change (%)" radius={[6, 6, 0, 0]}>
                {changeData.map((entry, i) => (
                  <Cell key={i} fill={entry['24h Change (%)'] >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
