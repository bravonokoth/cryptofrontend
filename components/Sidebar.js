import Link from 'next/link';
import { Home, BarChart2, Settings, Activity } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CryptoStream</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/" className="active">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/markets">
              <BarChart2 size={20} />
              <span>Markets</span>
            </Link>
          </li>
          <li>
            <Link href="/pipeline">
              <Activity size={20} />
              <span>Pipeline Status</span>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
