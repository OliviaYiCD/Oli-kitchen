"use client";

import { useState } from 'react';
import { ChevronLeft, Sparkles, Flame, Trash2, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { updateMeal, deleteMeal, translateText } from '../../add/actions';
import { toast } from 'sonner';

export default function EditMealForm({ meal }: { meal: any }) {
  const [nameEn, setNameEn] = useState(meal.name_en || "");
  const [nameCn, setNameCn] = useState(meal.name_cn || "");
  const [spicy, setSpicy] = useState(meal.spicy_level || 0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [labels, setLabels] = useState<string[]>(meal.label ? meal.label.split(',').filter(Boolean) : []);
  const [currentLabelInput, setCurrentLabelInput] = useState("");

  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const addLabel = () => {
    const trimmed = currentLabelInput.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels([...labels, trimmed]);
      setCurrentLabelInput("");
    }
  };

  return (
    <main style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: appFont,
      paddingBottom: '120px'
    }}>
      <form action={async (formData) => {
        // --- CRITICAL FIX: Manually set labels and spicy in formData ---
        formData.set('label', labels.join(','));
        formData.set('spicy_level', spicy.toString());
        
        setIsSaving(true);
        const toastId = toast.loading("Updating...");
        try {
          await updateMeal(meal.id, formData);
          toast.success("Saved!", { id: toastId });
        } catch (error) {
          toast.error("Failed to save", { id: toastId });
        } finally {
          setIsSaving(false);
        }
      }}>
        {/* Hidden inputs as secondary backup */}
        <input type="hidden" name="label" value={labels.join(',')} />
        <input type="hidden" name="spicy_level" value={spicy} />

        {/* Header */}
        <header style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}><ChevronLeft size={28} /></Link>
          <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Edit Recipe</h1>
          <button type="submit" disabled={isSaving} style={{ 
            backgroundColor: '#f97316', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 20px', 
            borderRadius: '20px', 
            fontWeight: '700',
            fontSize: '14px',
            opacity: isSaving ? 0.5 : 1
          }}>
            {isSaving ? '...' : 'Save'}
          </button>
        </header>

        <div style={{ padding: '24px' }}>
          
          {/* Taller Centered Image */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '100%', maxWidth: '800px', height: '400px', 
              backgroundColor: '#121212', borderRadius: '32px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' 
            }}>
              <img 
                src={meal.image_url || 'https://placehold.co/800x600'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* English Name */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#f97316', display: 'block', marginBottom: '8px' }}>MEAL NAME (EN)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  name="name_en"
                  type="text" 
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  style={{ 
                    width: '100%', backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', padding: '16px', color: '#fff', fontSize: '18px', fontWeight: '700', boxSizing: 'border-box' 
                  }} 
                />
                <button 
                  type="button" 
                  onClick={async () => {
                    setIsTranslating(true);
                    const translated = await translateText(nameEn);
                    setNameCn(translated);
                    setIsTranslating(false);
                  }}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#222', border: 'none', padding: '8px', borderRadius: '12px', color: '#f97316' }}
                >
                  {isTranslating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
              </div>
            </div>

            {/* Chinese Name */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', display: 'block', marginBottom: '8px' }}>CHINESE NAME</label>
              <input 
                name="name_cn"
                type="text" 
                value={nameCn}
                onChange={(e) => setNameCn(e.target.value)}
                style={{ 
                  width: '100%', backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', padding: '16px', color: '#888', fontSize: '18px', fontWeight: '700', boxSizing: 'border-box' 
                }} 
              />
            </div>

            {/* Labels */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', display: 'block', marginBottom: '8px' }}>LABELS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {labels.map(l => (
                  <span key={l} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {l} <X size={14} style={{ cursor: 'pointer', color: '#f97316' }} onClick={() => setLabels(labels.filter(x => x !== l))} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  value={currentLabelInput}
                  onChange={(e) => setCurrentLabelInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addLabel(); }}}
                  placeholder="Add label (e.g. Beef)..."
                  style={{ flex: 1, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', color: '#fff' }}
                />
                <button type="button" onClick={addLabel} style={{ backgroundColor: '#222', border: 'none', padding: '12px', borderRadius: '12px', color: '#fff' }}><Plus size={20} /></button>
              </div>
            </div>

            {/* Spicy Level */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', display: 'block', marginBottom: '12px', textAlign: 'center' }}>SPICY LEVEL</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} type="button" onClick={() => setSpicy(num)} style={{ 
                    aspectRatio: '1/1', borderRadius: '16px', border: '1px solid', 
                    borderColor: spicy >= num ? '#f97316' : 'rgba(255,255,255,0.05)',
                    backgroundColor: spicy >= num ? 'rgba(249,115,22,0.1)' : '#121212',
                    color: spicy >= num ? '#f97316' : '#222',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Flame size={20} fill={spicy >= num ? 'currentColor' : 'none'} />
                    <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '4px' }}>{num}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delete Button */}
            <div style={{ paddingTop: '40px' }}>
              <button 
                type="button" 
                onClick={async () => { 
                  if(confirm("Delete this recipe permanently?")) { 
                    await deleteMeal(meal.id); 
                    window.location.href = "/"; 
                  } 
                }} 
                style={{ 
                  width: '100%', padding: '16px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                  border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '16px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Trash2 size={18} /> Delete Recipe
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}