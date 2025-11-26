'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, FileText, ClipboardList, Heart, Car, DollarSign, AlertCircle, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  children?: Omit<NavItem, 'children'>[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Inicio',
    href: '/home',
    icon: <Home className="w-5 h-5" />,
    description: 'Página principal',
  },
  {
    title: 'Cotizar Seguro',
    href: '#',
    icon: <FileText className="w-5 h-5" />,
    description: 'Sección de cotizaciones',
    children: [
      {
        title: 'Salud',
        href: '/quote/health',
        icon: <Heart className="w-4 h-4" />,
      },
      {
        title: 'Vehicular',
        href: '/quote/vehicle',
        icon: <Car className="w-4 h-4" />,
      },
      {
        title: 'Vida',
        href: '/quote/life',
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        title: 'Vida y Ahorro',
        href: '/quote/life-savings',
        icon: <DollarSign className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Reportar Reclamo',
    href: '#',
    icon: <ClipboardList className="w-5 h-5" />,
    description: 'Sección de reclamos',
    children: [
      {
        title: 'Salud',
        href: '/claim/health',
        icon: <AlertCircle className="w-4 h-4" />,
      },
      {
        title: 'Vehicular',
        href: '/claim/vehicle',
        icon: <AlertCircle className="w-4 h-4" />,
      },
    ],
  },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Cotizar Seguro': true,
    'Reportar Reclamo': true,
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(href) && href !== '#';
  };

  const SidebarContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Form Engine</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de Formularios Dinámicos
            </p>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            const active = isActive(item.href);
            const isHeader = item.href === '#';
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedSections[item.title];

            if (isHeader && hasChildren) {
              return (
                <div key={index} className={cn('pt-2', index > 0 && 'mt-2')}>
                  <button
                    onClick={() => toggleSection(item.title)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded && item.children && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child, childIndex) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={childIndex}
                            href={child.href}
                            onClick={closeMobile}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all',
                              'hover:bg-gray-100',
                              childActive
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-medium'
                                : 'text-gray-700'
                            )}
                          >
                            {child.icon}
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular link (not a header)
            if (!isHeader) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all',
                    'hover:bg-gray-100',
                    active
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-medium'
                      : 'text-gray-700'
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              );
            }

            return null;
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <p className="text-xs text-gray-500">Versión: 2.1.0</p>
        <p className="text-xs text-gray-500">© 2025 LPC</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
