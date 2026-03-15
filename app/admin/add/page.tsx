"use client";

import { useState } from 'react';
import { Camera, Sparkles, Flame, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { saveMeal, translateText } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AddMealPage() {
  const router = useRouter();
  
  const [spicy, setSpicy] = useState(0);
  const [nameEn, setNameEn] = useState("");
  const [nameCn, setNameCn] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [currentLabelInput, setCurrentLabelInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const addLabel = () => {
    const trimmed = currentLabelInput.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels([...labels, trimmed]);
      setCurrentLabelInput("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
        const toastId = toast.loading("Saving to Vault...");
        try {
          await saveMeal(formData);
          toast.success("Added!", { id: toastId });
          router.push('/');
          router.refresh();
        } catch (error) {
          console.error(error);
          toast.error("Error saving.", { id: toastId });
        } finally {
          setIsSaving(false);
        }
      }}>
        <input type="hidden" name="label" value={labels.join(',')} />
        <input type="hidden" name="spicy_level" value={spicy} />

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
          zIndex: 100
        }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}><ChevronLeft size={28} /></Link>
          <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add to Vault</h1>
          <button type="submit" disabled={isSaving} style={{ 
            backgroundColor: '#f97316', color: '#fff', border: 'none', 
            padding: '8px 20px', borderRadius: '20px', fontWeight: '700', fontSize: '14px'
          }}>
            {isSaving ? '...' : 'Save'}
          </button>
        </header>

        <div style={{ padding: '24px' }}>
          
          {/* PHOTO BOX with full-area invisible file input */}
          <div 
            style={{ 
              position: 'relative',
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
              overflow: 'hidden',
              marginBottom: '32px'
            }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <Camera size={40} strokeWidth={1} />
                <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '8px' }}>ADD PHOTO</span>
              </>
            )}
            <input 
              type="file" 
              name="image_file" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
              style={{ 
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer'
              }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* EN Name */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#f97316', display: 'block', marginBottom: '8px' }}>MEAL NAME (EN)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  name="name_en" required value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', color: '#fff', fontSize: '18px', fontWeight: '700', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            {/* CN Name */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', display: 'block', marginBottom: '8px' }}>CHINESE NAME</label>
              <input 
                name="name_cn" value={nameCn}
                onChange={(e) => setNameCn(e.target.value)}
                style={{ width: '100%', backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', color: '#888', fontSize: '18px', fontWeight: '700', boxSizing: 'border-box' }} 
              />
            </div>
            {/* ... Rest of your form (Spicy, Labels, etc.) ... */}
          </div>
        </div>
      </form>
    </main>
  );
}