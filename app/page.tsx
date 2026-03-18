"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, UtensilsCrossed, Flame, Search, X, Bookmark, BookmarkCheck, LogOut, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const router = useRouter();
  const [meals, setMeals] = useState<any[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterMode, setFilterMode] = useState<"all" | "mine">("all"); // New toggle state
  const [activeSpicy, setActiveSpicy] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createClient();
  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserName(user.user_metadata?.full_name?.split(' ')[0] || "");
      setCurrentUserId(user.id);
      
      const { data: pinsData } = await supabase.from('user_pins').select('meal_id').eq('user_id', user.id);
      setPinnedIds(new Set(pinsData?.map(p => p.meal_id) || []));
    }

    const { data: mealsData } = await supabase.from('meals').select('*').order('created_at', { ascending: false });
    
    if (mealsData) setMeals(mealsData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const togglePin = async (e: React.MouseEvent, mealId: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (pinnedIds.has(mealId)) {
      await supabase.from('user_pins').delete().eq('user_id', user.id).eq('meal_id', mealId);
      setPinnedIds(prev => {
        const next = new Set(prev);
        next.delete(mealId);
        return next;
      });
    } else {
      await supabase.from('user_pins').insert({ user_id: user.id, meal_id: mealId });
      setPinnedIds(prev => new Set(prev).add(mealId));
    }
  };

  const allLabels = meals.reduce((acc: string[], meal: any) => {
    const labelData = meal.label as string | null;
    if (labelData) {
      const splitLabels = labelData.split(',').map((l: string) => l.trim()).filter(Boolean);
      return [...acc, ...splitLabels];
    }
    return acc;
  }, []);

  const uniqueLabels = ["All", ...Array.from(new Set(allLabels)).sort()];

  const filteredMeals = meals.filter(meal => {
    const matchesFilter = activeFilter === "All" || 
      (meal.label as string || "").split(',').map(l => l.trim()).includes(activeFilter);
    const matchesSearch = meal.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (meal.name_cn && meal.name_cn.includes(searchQuery));
    const matchesSpicy = activeSpicy === null || (meal.spicy_level || 0) === activeSpicy;
    
    // Check if meal belongs to user when "My Meals" is active
    const matchesUser = filterMode === "all" || meal.created_by === currentUserId;

    return matchesFilter && matchesSearch && matchesSpicy && matchesUser;
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
              <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em' }}>EXPLORE</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleLogout}
                style={{ 
                  backgroundColor: '#1A1A1A', color: '#666', border: 'none', 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                }}
              >
                <LogOut size={18} />
              </button>
              
              <Link href="/admin/add" style={{ backgroundColor: '#f97316', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <Plus size={22} />
              </Link>
            </div>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '800', margin: '0', letterSpacing: '-0.03em' }}>
            {userName ? `${userName}'s Kitchen` : 'MyKitchen'}
          </h1>
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

        {/* My Meals Toggle */}
        <div style={{ padding: '8px 24px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setFilterMode("all")}
            style={{
              padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700',
              backgroundColor: filterMode === "all" ? '#f9731622' : '#121212',
              color: filterMode === "all" ? '#f97316' : '#666',
              border: filterMode === "all" ? '1px solid #f97316' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Public Feed
          </button>
          <button 
            onClick={() => setFilterMode("mine")}
            style={{
              padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700',
              backgroundColor: filterMode === "mine" ? '#f9731622' : '#121212',
              color: filterMode === "mine" ? '#f97316' : '#666',
              border: filterMode === "mine" ? '1px solid #f97316' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <User size={14} /> My Meals
          </button>
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', 
          gap: '16px' 
        }}>
          {filteredMeals.map((meal) => {
            const isPinned = pinnedIds.has(meal.id);
            return (
              <Link href={`/meal/${meal.id}`} key={meal.id} style={{ textDecoration: 'none', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#121212', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', height: '100%' }}>
                  <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#1A1A1A', overflow: 'hidden', position: 'relative' }}>
                    <img src={meal.image_url || 'https://placehold.co/400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={meal.name_en} />
                    
                    <button 
                      onClick={(e) => togglePin(e, meal.id)}
                      style={{ 
                        position: 'absolute', top: '12px', right: '12px', 
                        backgroundColor: isPinned ? '#f97316' : 'rgba(0,0,0,0.5)',
                        border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', cursor: 'pointer', backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isPinned ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>
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
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}