import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TopMovers() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/prices')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => {
        const sorted = [...json].sort((a, b) => b.change_24h - a.change_24h);
        setGainers(sorted.slice(0, 4));
        setLosers(sorted.slice(-4).reverse());
      })
      .catch(err => { setError(err.message); });
  }, []);

  if (error) return (
    <div className="glass-card movers-container">
      <h2>Top Movers</h2>
      <div className="error-text">No data available</div>
    </div>
  );

  return (
    <div className="glass-card movers-container">
      <h2>Top Movers <span className="live-badge">LIVE</span></h2>
      <div className="movers-grid">
        <div className="movers-column">
          <div className="movers-col-header">
            <TrendingUp size={16} />
            <h3 className="text-success">Gainers</h3>
          </div>
          {gainers.map(coin => (
            <div key={coin.symbol} className="mover-item">
              <div className="mover-left">
                {coin.image && <img src={coin.image} alt={coin.symbol} width={22} height={22} style={{ borderRadius: '50%' }} />}
                <div>
                  <div className="mover-symbol">{coin.symbol}</div>
                  <div className="mover-price">${Number(coin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
              </div>
              <span className="change-badge positive">+{Number(coin.change_24h).toFixed(2)}%</span>
            </div>
          ))}
        </div>
        <div className="movers-column">
          <div className="movers-col-header">
            <TrendingDown size={16} />
            <h3 className="text-danger">Losers</h3>
          </div>
          {losers.map(coin => (
            <div key={coin.symbol} className="mover-item">
              <div className="mover-left">
                {coin.image && <img src={coin.image} alt={coin.symbol} width={22} height={22} style={{ borderRadius: '50%' }} />}
                <div>
                  <div className="mover-symbol">{coin.symbol}</div>
                  <div className="mover-price">${Number(coin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
              </div>
              <span className="change-badge negative">{Number(coin.change_24h).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
