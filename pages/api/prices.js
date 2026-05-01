// Simple in-memory cache to avoid hitting CoinGecko rate limits (30 calls/min free tier)
let cache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export default async function handler(req, res) {
  const now = Date.now();

  // Serve cached data if still fresh
  if (cache && now - cacheTime < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cache);
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h',
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CryptoStream/1.0',
        },
      }
    );

    if (!response.ok) {
      // If rate limited but we have stale cache, serve it rather than erroring
      if (response.status === 429 && cache) {
        console.warn('CoinGecko rate limited — serving stale cache');
        res.setHeader('X-Cache', 'STALE');
        return res.status(200).json(cache);
      }
      throw new Error(`CoinGecko responded with ${response.status}`);
    }

    const json = await response.json();

    const data = json.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      change_24h: coin.price_change_percentage_24h,
      volume_24h: coin.total_volume,
      market_cap: coin.market_cap,
      rank: coin.market_cap_rank,
    }));

    // Update cache
    cache = data;
    cacheTime = now;

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching prices:', error);

    // If we have any cached data at all, serve it rather than failing
    if (cache) {
      console.warn('Serving stale cache after error');
      res.setHeader('X-Cache', 'STALE');
      return res.status(200).json(cache);
    }

    res.status(500).json({ error: 'Failed to fetch prices. Please try again shortly.' });
  }
}
