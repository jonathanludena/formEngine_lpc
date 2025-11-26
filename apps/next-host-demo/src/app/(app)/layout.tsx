'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl lg:pt-8 pt-20">
          {children}
        </div>
      </main>
    </div>
  );
}
