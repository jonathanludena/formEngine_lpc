import Sidebar from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';
import { Route, Routes } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { ClaimPage } from './pages/ClaimPage';
import { HomePage } from './pages/HomePage';
import { UnifiedQuotePage } from './pages/UnifiedQuotePage';

const App = () => {
  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/cotizar', label: 'Cotizar Seguro', icon: '📝' },
    { path: '/reclamos', label: 'Reportar Reclamo', icon: '📋' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 z-20">
        <Sidebar navItems={navItems} />
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
            <Sidebar navItems={navItems} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64 overflow-auto">
        <Routes>
          <Route path="/formEngine_lpc" element={<HomePage />} />
          <Route path="/formEngine_lpc/cotizar" element={<UnifiedQuotePage />} />
          <Route path="/formEngine_lpc/reclamos" element={<ClaimPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
