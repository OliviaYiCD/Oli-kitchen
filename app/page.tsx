"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; 
import Link from 'next/link';
import { Plus, UtensilsCrossed, Flame, ChevronRight, Search, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const [meals, setMeals] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase.from('meals').select('*').order('created_at', { ascending: false });
      if (data) setMeals(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Process Labels
  const allLabels = meals.reduce((acc: string[], meal: any) => {
    const labelData = meal.label as string | null;
    if (labelData) {
      const splitLabels = labelData.split(',').map((l: string) => l.trim()).filter(Boolean);
      return [...acc, ...splitLabels];
    }
    return acc;
  }, []);

  const uniqueLabels = ["All", ...Array.from(new Set(allLabels)).sort()];

  // Filter & Search Logic Combined
  const filteredMeals = meals.filter(meal => {
    const matchesFilter = activeFilter === "All" || 
      (meal.label as string || "").split(',').map(l => l.trim()).includes(activeFilter);
    
    const matchesSearch = meal.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (meal.name_cn && meal.name_cn.includes(searchQuery));

    return matchesFilter && matchesSearch;
  });

  if (loading) return <div style={{ backgroundColor: '#000', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: appFont }}>
      
      {/* Header */}
      <div style={{ padding: '32px 24px 8px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316' }}>
            <UtensilsCrossed size={18} />
            <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em' }}>VAULT</span>
          </div>
          <Link href="/admin/add" style={{ backgroundColor: '#f97316', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <Plus size={22} />
          </Link>
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: '800', margin: '0', letterSpacing: '-0.03em' }}>Oli's Kitchen</h1>
      </div>

      {/* Search Bar Section */}
      <div style={{ padding: '16px 24px 8px 24px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', color: '#444' }} />
          <input 
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#121212',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '14px 14px 14px 48px',
              color: '#fff',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <X 
              size={18} 
              onClick={() => setSearchQuery("")}
              style={{ position: 'absolute', right: '16px', color: '#666', cursor: 'pointer' }} 
            />
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '12px 24px 24px 24px' }}>
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {uniqueLabels.map((label) => {
          const isActive = activeFilter === label;
          return (
            <button 
              key={label} 
              onClick={() => setActiveFilter(label)}
              style={{
                whiteSpace: 'nowrap', padding: '8px 20px', borderRadius: '20px',
                backgroundColor: isActive ? '#fff' : '#121212',
                color: isActive ? '#000' : '#888',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)',
                fontSize: '13px', fontWeight: '700', transition: 'all 0.2s ease', cursor: 'pointer'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div style={{ padding: '0 20px 140px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredMeals.map((meal) => (
          <Link href={`/admin/edit/${meal.id}`} key={meal.id} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '12px', backgroundColor: '#121212', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '85px', height: '85px', backgroundColor: '#1A1A1A', borderRadius: '20px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={meal.image_url || 'https://placehold.co/200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                <h3 style={{ margin: '0', color: '#fff', fontSize: '17px', fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{meal.name_en}</h3>
                <p style={{ margin: '2px 0 8px 0', color: '#666', fontSize: '14px', fontWeight: '500' }}>{meal.name_cn}</p>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Flame key={i} size={14} fill={i < (meal.spicy_level || 0) ? '#f97316' : 'none'} color={i < (meal.spicy_level || 0) ? '#f97316' : '#222'} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#333', paddingRight: '4px' }}>
                <ChevronRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}