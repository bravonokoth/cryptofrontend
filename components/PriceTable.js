import { useState, useEffect } from 'react';

export default function PriceTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="glass-card loading-card">Fetching real-time data...</div>;
  }

  return (
    <div className="glass-card">
      <h2>Top 20 Cryptocurrencies</h2>
      <div className="table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {data.map(coin => (
              <tr key={coin.symbol} className="table-row">
                <td className="symbol-cell">
                  <div className="coin-icon">{coin.symbol.charAt(0)}</div>
                  <strong>{coin.symbol}</strong>
                </td>
                <td>${Number(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                <td className={coin.change_24h >= 0 ? 'text-success' : 'text-danger'}>
                  {coin.change_24h > 0 ? '+' : ''}{Number(coin.change_24h).toFixed(2)}%
                </td>
                <td>${(Number(coin.volume_24h) / 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
