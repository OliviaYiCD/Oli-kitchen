"use client";

import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import BottomNav from '@/components/BottomNav';
import { Plus, Search, CalendarDays, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function WeeklyPlan() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{key: string, cn: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLabel, setActiveLabel] = useState("All"); 
  const [meals, setMeals] = useState<any[]>([]); 
  const [plan, setPlan] = useState<any>({});    
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const days = [
    { key: "Mon", cn: "周一" }, { key: "Tue", cn: "周二" },
    { key: "Wed", cn: "周三" }, { key: "Thu", cn: "周四" },
    { key: "Fri", cn: "周五" }, { key: "Sat", cn: "周六" },
    { key: "Sun", cn: "周日" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: mealsData } = await supabase.from('meals').select('*').order('name_en');
    const { data: planData } = await supabase.from('weekly_plan').select('*, meals(*)');
    
    if (mealsData) setMeals(mealsData);
    
    const grouped = planData?.reduce((acc: any, item: any) => {
      if (!acc[item.day_of_week]) acc[item.day_of_week] = [];
      acc[item.day_of_week].push(item);
      return acc;
    }, {}) || {};

    setPlan(grouped);
    setLoading(false);
  }

  const allLabels = meals.reduce((acc: string[], meal: any) => {
    const labelData = meal.label as string | null;
    if (labelData) {
      const splitLabels = labelData.split(',').map((l: string) => l.trim()).filter(Boolean);
      return [...acc, ...splitLabels];
    }
    return acc;
  }, []);
  const uniqueLabels = ["All", ...Array.from(new Set(allLabels)).sort()];

  const handleOpenDrawer = (day: {key: string, cn: string}) => {
    setSelectedDay(day);
    setActiveLabel("All");
    setIsOpen(true);
  };

  async function addMealToDay(mealId: string) {
    if (!selectedDay) return;
    const { error } = await supabase.from('weekly_plan').insert({ 
      day_of_week: selectedDay.key, 
      meal_id: mealId 
    });
    
    if (!error) {
      fetchData();
      setIsOpen(false); 
      setSearchQuery("");
    }
  }

  async function removeFromPlan(id: string) {
    await supabase.from('weekly_plan').delete().eq('id', id);
    fetchData();
  }

  const filteredRecipes = meals.filter(m => {
    const matchesLabel = activeLabel === "All" || 
      (m.label as string || "").split(',').map(l => l.trim()).includes(activeLabel);
    const matchesSearch = m.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.name_cn && m.name_cn.includes(searchQuery));
    return matchesLabel && matchesSearch;
  });

  if (loading) return <div style={{ backgroundColor: '#000', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: appFont }}>
      
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
        
        <header style={{ padding: '32px 24px 16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', marginBottom: '8px' }}>
            <CalendarDays size={18} />
            <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em' }}>PLANNER</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>Weekly Plan</h1>
        </header>

        <div style={{ padding: '12px 20px 140px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {days.map((day) => (
            <div key={day.key} style={{ backgroundColor: '#121212', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '58px', height: '58px', borderRadius: '20px', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '9px', fontWeight: '900', color: '#f97316', marginBottom: '2px' }}>{day.key}</span>
                  <span style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>{day.cn}</span>
                </div>
                <div style={{ flex: 1, fontSize: '15px', color: '#444', fontWeight: '600' }}>
                  {plan[day.key]?.length ? `${plan[day.key].length} meals` : 'Empty plan'}
                </div>
                <button onClick={() => handleOpenDrawer(day)} style={{ backgroundColor: '#1A1A1A', color: '#f97316', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={20} />
                </button>
              </div>

              {plan[day.key]?.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan[day.key].map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#1A1A1A', borderRadius: '18px' }}>
                      <img src={item.meals.image_url} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{item.meals.name_en}</div>
                        <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>{item.meals.name_cn}</div>
                      </div>
                      <button onClick={() => removeFromPlan(item.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Drawer.Portal>
          <Drawer.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000 }} />
          <Drawer.Content style={{ backgroundColor: '#161616', display: 'flex', flexDirection: 'column', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', height: '85%', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10001, outline: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <div style={{ margin: '0 auto', width: '36px', height: '5px', borderRadius: '10px', backgroundColor: '#333', marginBottom: '28px' }} />
              
              <Drawer.Title style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', textAlign: 'center', color: '#fff' }}>
                Add to <span style={{ color: '#f97316' }}>{selectedDay?.cn}</span>
              </Drawer.Title>
              
              <Drawer.Description style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginBottom: '20px' }}>
                Search or filter to find a dish.
              </Drawer.Description>
              
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} size={18} />
                <input 
                  style={{ width: '100%', backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px', padding: '14px 14px 14px 44px', color: '#fff', fontSize: '16px', outline: 'none' }}
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 0 24px 0' }}>
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                {uniqueLabels.map((label) => (
                  <button 
                    key={label} 
                    onClick={() => setActiveLabel(label)}
                    style={{
                      whiteSpace: 'nowrap', padding: '8px 18px', borderRadius: '20px',
                      backgroundColor: activeLabel === label ? '#fff' : '#222',
                      color: activeLabel === label ? '#000' : '#888',
                      border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', paddingBottom: '40px' }}>
                {filteredRecipes.map(meal => (
                  <div key={meal.id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#222', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addMealToDay(meal.id); }}
                      style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#f97316', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)' }}
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                    <div style={{ width: '100%', aspectRatio: '1/1' }}>
                       <img src={meal.image_url || 'https://placehold.co/400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={meal.name_en} />
                    </div>
                    <div style={{ padding: '10px' }}>
                      <p style={{ fontWeight: '700', fontSize: '14px', margin: 0, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meal.name_en}</p>
                      <p style={{ fontSize: '11px', color: '#666', margin: '2px 0 0 0', fontWeight: '500' }}>{meal.name_cn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <BottomNav />
    </div>
  );
}