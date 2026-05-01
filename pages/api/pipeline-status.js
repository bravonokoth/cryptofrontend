export default async function handler(req, res) {
  try {
    // Ping CoinGecko to check API reachability as a proxy for pipeline health
    const start = Date.now();
    const response = await fetch(
      'https://api.coingecko.com/api/v3/ping',
      { headers: { 'Accept': 'application/json', 'User-Agent': 'CryptoStream/1.0' } }
    );
    const latency = Date.now() - start;

    if (!response.ok) {
      throw new Error('CoinGecko unreachable');
    }

    res.status(200).json({
      status: 'healthy',
      source: 'coingecko',
      last_run_time: new Date().toISOString(),
      latency_ms: latency,
      rows_ingested: null,
      note: 'Database not yet connected — live data sourced from CoinGecko.',
    });
  } catch (error) {
    console.error('Pipeline status check failed:', error);
    res.status(500).json({ error: 'Pipeline status unavailable' });
  }
}
