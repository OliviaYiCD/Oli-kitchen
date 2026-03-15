"use client";

import { useState } from 'react';
import { Camera, Sparkles, Flame, Save, ChevronLeft, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { saveMeal, translateText } from './actions';
import { toast } from 'sonner';

export default function AddMealPage() {
  const [spicy, setSpicy] = useState(0);
  const [nameEn, setNameEn] = useState("");
  const [nameCn, setNameCn] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
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
      paddingBottom: '100px'
    }}>
      <form action={async (formData) => {
        setIsSaving(true);
        const toastId = toast.loading("Saving...");
        await saveMeal(formData);
        toast.success("Added!", { id: toastId });
        setIsSaving(false);
      }}>
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
          <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add to Vault</h1>
          <button type="submit" disabled={isSaving} style={{ 
            backgroundColor: '#f97316', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 20px', 
            borderRadius: '20px', 
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {isSaving ? '...' : 'Save'}
          </button>
        </header>

        <div style={{ padding: '24px' }}>
          {/* Image Placeholder */}
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            backgroundColor: '#121212', 
            borderRadius: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px dashed rgba(255,255,255,0.1)',
            color: '#444',
            marginBottom: '32px'
          }}>
            <Camera size={40} strokeWidth={1} />
            <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '8px' }}>ADD PHOTO</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* EN Name */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#f97316', display: 'block', marginBottom: '8px' }}>MEAL NAME (EN)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  name="name_en"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Mapo Tofu"
                  style={{ 
                    width: '100%', backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', padding: '16px', color: '#fff', fontSize: '18px', fontWeight: '700', boxSizing: 'border-box' 
                  }} 
                />
                <button 
                  type="button"
                  onClick={async () => {
                    setIsTranslating(true);
                    setNameCn(await translateText(nameEn));
                    setIsTranslating(false);
                  }}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#222', border: 'none', padding: '8px', borderRadius: '12px', color: '#f97316' }}
                >
                  {isTranslating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
              </div>
            </div>

            {/* CN Name */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', display: 'block', marginBottom: '8px' }}>CHINESE NAME</label>
              <input 
                name="name_cn"
                value={nameCn}
                onChange={(e) => setNameCn(e.target.value)}
                placeholder="麻婆豆腐"
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
                  <span key={l} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {l} <X size={14} onClick={() => setLabels(labels.filter(x => x !== l))} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  value={currentLabelInput}
                  onChange={(e) => setCurrentLabelInput(e.target.value)}
                  placeholder="Add label..."
                  style={{ flex: 1, backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', color: '#fff' }}
                />
                <button type="button" onClick={addLabel} style={{ backgroundColor: '#222', border: 'none', padding: '12px', borderRadius: '12px', color: '#fff' }}><Plus size={20} /></button>
              </div>
            </div>

            {/* Spicy */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', display: 'block', marginBottom: '12px', textAlign: 'center' }}>SPICY LEVEL</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} type="button" onClick={() => setSpicy(num)} style={{ 
                    aspectRatio: '1/1', borderRadius: '16px', border: '1px solid', 
                    borderColor: spicy >= num ? '#f97316' : 'rgba(255,255,255,0.05)',
                    backgroundColor: spicy >= num ? 'rgba(249,115,22,0.1)' : '#121212',
                    color: spicy >= num ? '#f97316' : '#222',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Flame size={20} fill={spicy >= num ? 'currentColor' : 'none'} />
                    <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '4px' }}>{num}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}