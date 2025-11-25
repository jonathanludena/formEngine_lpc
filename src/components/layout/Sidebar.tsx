import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

type Props = {
  navItems: NavItem[];
  version?: string;
};

const Sidebar: React.FC<Props> = ({ navItems, version = '2.1.0' }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r min-h-screen p-6 relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Form Engine</h1>
        <p className="text-sm text-muted-foreground">Sistema de Cotizaciones</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Version: {version}</p>
          <p>© 2024 LPC</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
