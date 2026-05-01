import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import PriceTable from '../components/PriceTable';
import TopMovers from '../components/TopMovers';
import PipelineHealth from '../components/PipelineHealth';
import MarketChart from '../components/MarketChart';

export default function Dashboard() {
  return (
    <div className="app-layout">
      <Head>
        <title>CryptoStream Dashboard</title>
      </Head>
      <Sidebar />
      <main className="main-content">
        <div className="container">
          <header className="dashboard-header">
            <h1>CryptoStream Dashboard</h1>
            <p className="text-muted">Real-time market overview and ingestor pipeline status</p>
          </header>

          <div className="dashboard-grid">
            <section className="health-section">
              <PipelineHealth />
            </section>
            
            <section className="movers-section">
              <TopMovers />
            </section>
          </div>

          <section className="chart-section" style={{ marginBottom: '24px' }}>
            <MarketChart />
          </section>

          <section className="table-section">
            <PriceTable />
          </section>
        </div>
      </main>
    </div>
  );
}
