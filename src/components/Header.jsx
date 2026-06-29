import React from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat, LogOut, Bell } from 'lucide-react';

const Header = () => {
  const navItems = [
    { path: '/operations', label: 'Incoming Orders' },
    { path: '/stations', label: 'Kitchen Status' },
    { path: '/batches', label: 'Batch Manager' },
    { path: '/menu', label: 'Menu & Stock' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/analytics', label: 'Insights' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <a href="/operations" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">KitchenOS</span>
          </a>
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = item.path === '/operations';
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-all ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-on-track opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-status-on-track"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Kitchen Active</span>
          </div>
          <div className="h-8 w-px bg-border mx-2 hidden md:block"></div>
          <Button variant="ghost" size="icon" className="relative" onClick={() => window.location.href='/alerts'}>
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-urgent"></span>
          </Button>
          <Button onClick={() => window.location.href='/login'} variant="outline" size="sm" className="font-semibold">
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
