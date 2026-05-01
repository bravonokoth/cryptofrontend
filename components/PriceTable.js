import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PriceTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    fetch('/api/prices')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...data].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    return (a[sortKey] > b[sortKey] ? 1 : -1) * mul;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}> ↕</span>;
    return <span style={{ color: 'var(--accent)' }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>;
  };

  if (loading) return <div className="glass-card loading-card">Fetching live prices from CoinGecko…</div>;

  if (error) return (
    <div className="glass-card">
      <h2>Top 20 Cryptocurrencies</h2>
      <div className="error-text">Unable to load market data. {error}</div>
    </div>
  );

  return (
    <div className="glass-card">
      <h2>Top 20 Cryptocurrencies <span className="live-badge">LIVE</span></h2>
      <div className="table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rank')} className="sortable">#<SortIcon col="rank" /></th>
              <th>Asset</th>
              <th onClick={() => handleSort('price')} className="sortable">Price (USD)<SortIcon col="price" /></th>
              <th onClick={() => handleSort('change_24h')} className="sortable">24h %<SortIcon col="change_24h" /></th>
              <th onClick={() => handleSort('volume_24h')} className="sortable">Volume 24h<SortIcon col="volume_24h" /></th>
              <th onClick={() => handleSort('market_cap')} className="sortable">Market Cap<SortIcon col="market_cap" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(coin => (
              <tr key={coin.symbol} className="table-row">
                <td className="rank-cell">{coin.rank}</td>
                <td className="symbol-cell">
                  {coin.image
                    ? <img src={coin.image} alt={coin.symbol} width={28} height={28} style={{ borderRadius: '50%' }} />
                    : <div className="coin-icon">{coin.symbol.charAt(0)}</div>}
                  <div>
                    <div style={{ fontWeight: 600 }}>{coin.symbol}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{coin.name}</div>
                  </div>
                </td>
                <td className="price-cell">
                  ${Number(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: coin.price < 1 ? 6 : 2 })}
                </td>
                <td>
                  <span className={`change-badge ${coin.change_24h >= 0 ? 'positive' : 'negative'}`}>
                    {coin.change_24h > 0 ? '+' : ''}{Number(coin.change_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="text-muted">${(Number(coin.volume_24h) / 1e9).toFixed(2)}B</td>
                <td className="text-muted">${(Number(coin.market_cap) / 1e9).toFixed(1)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
