"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; 
import Link from 'next/link';
import { Plus, UtensilsCrossed, Flame, Search, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const [meals, setMeals] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSpicy, setActiveSpicy] = useState<number | null>(null); // New State
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

  const allLabels = meals.reduce((acc: string[], meal: any) => {
    const labelData = meal.label as string | null;
    if (labelData) {
      const splitLabels = labelData.split(',').map((l: string) => l.trim()).filter(Boolean);
      return [...acc, ...splitLabels];
    }
    return acc;
  }, []);

  const uniqueLabels = ["All", ...Array.from(new Set(allLabels)).sort()];

  // Updated Filter Logic
  const filteredMeals = meals.filter(meal => {
    const matchesFilter = activeFilter === "All" || 
      (meal.label as string || "").split(',').map(l => l.trim()).includes(activeFilter);
    
    const matchesSearch = meal.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (meal.name_cn && meal.name_cn.includes(searchQuery));

    // New Spicy Match
    const matchesSpicy = activeSpicy === null || (meal.spicy_level || 0) === activeSpicy;

    return matchesFilter && matchesSearch && matchesSpicy;
  });

  if (loading) return <div style={{ backgroundColor: '#000', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: appFont }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ padding: '32px 24px 8px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316' }}>
              <UtensilsCrossed size={18} />
              <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em' }}>MEALS</span>
            </div>
            <Link href="/admin/add" style={{ backgroundColor: '#f97316', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <Plus size={22} />
            </Link>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '800', margin: '0', letterSpacing: '-0.03em' }}>Oli's Kitchen</h1>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 24px 8px 24px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', color: '#444' }} />
            <input 
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '14px 14px 14px 48px', color: '#fff', fontSize: '16px', outline: 'none' }}
            />
            {searchQuery && <X size={18} onClick={() => setSearchQuery("")} style={{ position: 'absolute', right: '16px', color: '#666' }} />}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '12px 24px 8px 24px' }}>
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {uniqueLabels.map((label) => (
            <button 
              key={label} 
              onClick={() => setActiveFilter(label)}
              style={{
                whiteSpace: 'nowrap', padding: '8px 20px', borderRadius: '20px',
                backgroundColor: activeFilter === label ? '#fff' : '#121212',
                color: activeFilter === label ? '#000' : '#888',
                border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Spicy Level Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 24px 24px 24px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#444', marginRight: '4px' }}>SPICINESS:</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setActiveSpicy(activeSpicy === level ? null : level)}
              style={{
                backgroundColor: activeSpicy === level ? '#f9731622' : '#121212',
                border: activeSpicy === level ? '1px solid #f97316' : '1px solid transparent',
                borderRadius: '12px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', color: activeSpicy === level ? '#f97316' : '#666' }}>{level}</span>
              <Flame size={12} fill={level > 0 ? (activeSpicy === level ? '#f97316' : '#444') : 'none'} color={level > 0 ? (activeSpicy === level ? '#f97316' : '#444') : '#444'} />
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div style={{ 
          padding: '0 24px 140px 24px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '16px' 
        }}>
          {filteredMeals.map((meal) => (
            <Link href={`/meal/${meal.id}`} key={meal.id} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#121212', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', height: '100%' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#1A1A1A', overflow: 'hidden' }}>
                  <img src={meal.image_url || 'https://placehold.co/400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={meal.name_en} />
                </div>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ margin: '0', color: '#fff', fontSize: '15px', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{meal.name_en}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '12px', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{meal.name_cn}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Flame key={i} size={12} fill={i < (meal.spicy_level || 0) ? '#f97316' : 'none'} color={i < (meal.spicy_level || 0) ? '#f97316' : '#222'} />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}