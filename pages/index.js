import Head from 'next/head';
import PriceTable from '../components/PriceTable';
import TopMovers from '../components/TopMovers';
import PipelineHealth from '../components/PipelineHealth';

export default function Dashboard() {
  return (
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

      <section className="table-section">
        <PriceTable />
      </section>
    </div>
  );
}
