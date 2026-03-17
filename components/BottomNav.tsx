"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, CalendarDays } from 'lucide-react'; // Added CalendarDays

export default function BottomNav() {
  const pathname = usePathname();
  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  const navItems = [
    { icon: Home, label: 'Vault', path: '/' },
    { icon: CalendarDays, label: 'Planner', path: '/weekly' }, // New Item
    { icon: PlusCircle, label: 'Add', path: '/admin/add' },
  ];

  return (
    <nav style={{
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '12px 24px 34px 24px', 
      zIndex: 9999,
      fontFamily: appFont
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', // Changed to between for 3 items
        alignItems: 'center', 
        maxWidth: '500px', // Slightly wider for 3 items
        margin: '0 auto' 
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '6px', 
              color: isActive ? '#f97316' : '#444',
              transition: 'all 0.2s ease',
              padding: '0 10px',
              flex: 1 // Ensures even tapping areas
            }}>
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '900', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}