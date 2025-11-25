import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { HomePage } from './pages/HomePage';
import { UnifiedQuotePage } from './pages/UnifiedQuotePage';
import { ClaimPage } from './pages/ClaimPage';

const App = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/cotizar', label: 'Cotizar Seguro', icon: '📝' },
    { path: '/reclamos', label: 'Reportar Reclamo', icon: '📋' },
  ];

  const Sidebar = () => (
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
              location.pathname === item.path
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Version: 2.1.0</p>
          <p>© 2024 LPC</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 z-20">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cotizar" element={<UnifiedQuotePage />} />
          <Route path="/reclamos" element={<ClaimPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
