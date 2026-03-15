"use client";

import { useState } from 'react';
import { Drawer } from 'vaul';
import BottomNav from '@/components/BottomNav';
import { Plus, Search, Utensils, CalendarDays, X } from 'lucide-react';

export default function WeeklyPlan() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const days = [
    { key: "Mon", cn: "周一" }, { key: "Tue", cn: "周二" },
    { key: "Wed", cn: "周三" }, { key: "Thu", cn: "周四" },
    { key: "Fri", cn: "周五" }, { key: "Sat", cn: "周六" },
    { key: "Sun", cn: "周日" }
  ];

  const myMeals = [
    { id: 1, name_en: "Mapo Tofu", name_cn: "麻婆豆腐" },
    { id: 2, name_en: "Kung Pao Chicken", name_cn: "宫保鸡丁" }
  ];

  return (
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: appFont,
      WebkitFontSmoothing: 'antialiased'
    }}>
      {/* Header - Fixed to match the Home Page style */}
      <header style={{ 
        padding: '32px 24px 16px 24px',
        backgroundColor: '#000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', marginBottom: '8px' }}>
          <CalendarDays size={18} />
          <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em' }}>PLANNER</span>
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>Weekly Plan</h1>
      </header>

      {/* Days List */}
      <div style={{ padding: '12px 20px 140px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {days.map((day) => (
          <Drawer.Root key={day.key} shouldScaleBackground onOpenChange={(open) => { if(!open) setSelectedDay(null); else setSelectedDay(day.key); }}>
            <Drawer.Trigger asChild>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', 
                borderRadius: '28px', border: '1px dashed rgba(255,255,255,0.12)', 
                backgroundColor: 'rgba(255,255,255,0.02)', cursor: 'pointer' 
              }}>
                {/* Day Badge */}
                <div style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  minWidth: '58px', height: '58px', borderRadius: '20px', 
                  backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <span style={{ fontSize: '9px', fontWeight: '900', color: '#f97316', marginBottom: '2px' }}>{day.key}</span>
                  <span style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>{day.cn}</span>
                </div>
                
                <div style={{ flex: 1, fontSize: '15px', color: '#333', fontWeight: '600' }}>Add dinner...</div>
                
                <div style={{ padding: '8px', color: '#f97316' }}>
                  <Plus size={24} />
                </div>
              </div>
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000 }} />
              <Drawer.Content style={{ 
                backgroundColor: '#161616', 
                display: 'flex', flexDirection: 'column', 
                borderTopLeftRadius: '40px', borderTopRightRadius: '40px', 
                height: '85%', position: 'fixed', bottom: 0, left: 0, right: 0, 
                zIndex: 10001, outline: 'none',
                border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none'
              }}>
                <div style={{ padding: '20px', flex: 1, fontFamily: appFont }}>
                  {/* Handlebar */}
                  <div style={{ margin: '0 auto', width: '36px', height: '5px', borderRadius: '10px', backgroundColor: '#333', marginBottom: '28px' }} />
                  
                  <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#fff', textAlign: 'center' }}>
                      Lunch/Dinner for <span style={{ color: '#f97316' }}>{selectedDay}</span>
                    </h2>
                    
                    {/* Search Bar */}
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                      <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} size={20} />
                      <input 
                        style={{ 
                          width: '100%', backgroundColor: '#000', border: '1px solid #222', borderRadius: '18px', 
                          padding: '16px 16px 16px 48px', color: '#fff', fontSize: '16px', boxSizing: 'border-box',
                          outline: 'none'
                        }}
                        placeholder="Search your recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Meal Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '50vh', paddingBottom: '40px' }}>
                      {myMeals.map(meal => (
                        <button key={meal.id} style={{ 
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                          padding: '16px', backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '24px', cursor: 'pointer', textAlign: 'left'
                        }}>
                          <div>
                            <p style={{ fontWeight: '700', color: '#fff', fontSize: '17px', margin: 0 }}>{meal.name_en}</p>
                            <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0 0', fontWeight: '500' }}>{meal.name_cn}</p>
                          </div>
                          <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '50%', color: '#f97316' }}>
                            <Plus size={18} strokeWidth={3} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}