import React from 'react';
import { useLocation } from 'wouter';
import {
  Home,
  Map,
  Truck,
  AlertTriangle,
  Bot,
  Bell,
  Shield,
  PhoneCall,
  Menu,
} from 'lucide-react';
import { useOperating } from '../context/OperatingContext';

interface MobileBottomNavProps {
  onOpenSecondaryMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenSecondaryMenu }) => {
  const [location, setLocation] = useLocation();
  const { isOnline, pendingOfflineReportsCount, activeAlertsCount } = useOperating();

  const navItems = [
    {
      id: 'nav-home',
      label: 'HOME',
      path: '/',
      icon: Home,
      isActive: location === '/' || location === '/command-center',
    },
    {
      id: 'nav-map',
      label: 'MAP',
      path: '/map',
      icon: Map,
      isActive: location === '/map' || location.startsWith('/map'),
    },
    {
      id: 'nav-logistics',
      label: 'LOGISTICS',
      path: '/cargo',
      icon: Truck,
      isActive: location === '/cargo' || location === '/vehicles' || location === '/my-cargo',
    },
    {
      id: 'nav-report',
      label: 'REPORT',
      path: '/report',
      icon: AlertTriangle,
      isActive: location === '/report' || location.startsWith('/report'),
      badge: pendingOfflineReportsCount > 0 ? pendingOfflineReportsCount : undefined,
      badgeColor: !isOnline ? 'bg-amber-500' : 'bg-red-500',
    },
    {
      id: 'nav-ai',
      label: 'AI',
      path: '/ai-assistant',
      icon: Bot,
      isActive: location === '/ai-assistant',
      special: true,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            id={item.id}
            onClick={() => setLocation(item.path)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative min-h-[48px] touch-manipulation ${
              item.isActive
                ? 'text-emerald-400 font-bold bg-slate-800/80 scale-105'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${item.isActive ? 'text-emerald-400' : ''}`} />
              {item.badge !== undefined && (
                <span
                  className={`absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 text-[9px] font-black rounded-full text-white flex items-center justify-center ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wider mt-1 font-mono uppercase">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Secondary More Menu Trigger */}
      <button
        id="nav-secondary-menu"
        onClick={onOpenSecondaryMenu}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all min-h-[48px] touch-manipulation"
      >
        <div className="relative">
          <Menu className="w-5 h-5" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>
        <span className="text-[10px] tracking-wider mt-1 font-mono uppercase">
          MORE
        </span>
      </button>
    </nav>
  );
};
