import { useState, useEffect } from 'react';

export default function TopMovers() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(json => {
        const sorted = [...json].sort((a, b) => b.change_24h - a.change_24h);
        setGainers(sorted.slice(0, 3));
        setLosers(sorted.slice(-3).reverse());
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="glass-card movers-container">
      <h2>Top Movers</h2>
      <div className="movers-grid">
        <div className="movers-column">
          <h3 className="text-success">Gainers</h3>
          {gainers.map(coin => (
            <div key={coin.symbol} className="mover-item">
              <span className="mover-symbol">{coin.symbol}</span>
              <span className="mover-change text-success">+{Number(coin.change_24h).toFixed(2)}%</span>
            </div>
          ))}
        </div>
        <div className="movers-column">
          <h3 className="text-danger">Losers</h3>
          {losers.map(coin => (
            <div key={coin.symbol} className="mover-item">
              <span className="mover-symbol">{coin.symbol}</span>
              <span className="mover-change text-danger">{Number(coin.change_24h).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
