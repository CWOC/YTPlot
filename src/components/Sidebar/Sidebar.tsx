import { useState } from 'preact/hooks';
import { Link, useLocation } from 'wouter-preact';
import styles from './Sidebar.module.css';

interface RouteItem {
  path: string;
  name: string;
  icon: string;
}

const ROUTES: RouteItem[] = [
  { path: '/', name: 'Inicio', icon: 'home' },
  { path: '/dashboard', name: 'Dashboard', icon: 'widgets' },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}
      aria-label="Navegación principal"
    >
      <div className={styles.header}>
        <span className={styles.logoText}>YTPlot</span>
      </div>

      <hr className={styles.divider} />

      <nav className={styles.nav}>
        {ROUTES.map((route) => {
          const isActive = location === route.path;
          return (
            <Link
              key={route.path}
              href={route.path}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className="material-symbols-outlined">{route.icon}</span>
              <span className={styles.linkText}>{route.name}</span>
            </Link>
          );
        })}
      </nav>

      <button
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Contraer menú de navegación' : 'Expandir menú de navegación'}
      >
        <span className="material-symbols-outlined">{isOpen ? 'logout' : 'login'}</span>
      </button>
    </aside>
  );
}
