import { useState } from 'preact/hooks';
import { Switch, Route } from 'wouter-preact';
import { Sidebar } from './components/Sidebar/Sidebar';
/** Pages */
import { HomePage } from './pages/home/HomePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { NotFoundPage } from './pages/404/NotFoundPage';

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="appLayout">
      <Sidebar isOpen={isSidebarOpen} />

      <button
        className={`toggleButton ${!isSidebarOpen ? 'collapsedButton' : ''}`}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Contraer menú de navegación' : 'Expandir menú de navegación'}
      >
        <span className="material-symbols-outlined">{isSidebarOpen ? 'logout' : 'login'}</span>
      </button>

      <main className="mainContent">
        <div className="pageContainer">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </main>
    </div>
  );
}
