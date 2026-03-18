"use client";

import { createClient } from '@/lib/supabase/client';
import { UtensilsCrossed, ChefHat, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // ADDED THIS: This forces Google to show the account picker
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
  };

  const appFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  return (
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px',
      color: '#fff',
      fontFamily: appFont
    }}>
      {/* Animated Icon Section */}
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <div style={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          color: '#fbbf24',
          animation: 'pulse 2s infinite' 
        }}>
          <Sparkles size={24} />
        </div>
        <div style={{ 
          backgroundColor: '#f9731615', 
          padding: '20px', 
          borderRadius: '30px',
          color: '#f97316' 
        }}>
          <UtensilsCrossed size={54} strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Branding */}
      <h1 style={{ 
        fontSize: '42px', 
        fontWeight: '900', 
        marginBottom: '12px', 
        letterSpacing: '-0.05em' 
      }}>
        My Kitchen
      </h1>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#eee', 
          margin: '0 0 8px 0' 
        }}>
          Your personal culinary vault.
        </p>
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          maxWidth: '260px', 
          lineHeight: '1.5',
          margin: '0 auto'
        }}>
          Pin world-class recipes, organize your week, and cook like a pro.
        </p>
      </div>

      {/* Google Button */}
      <button 
        onClick={loginWithGoogle}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '16px 24px',
          borderRadius: '100px',
          backgroundColor: '#fff',
          color: '#000',
          border: 'none',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.1)'
        }}
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          width="20" 
          height="20" 
          alt="" 
        />
        Continue with Google
      </button>

      {/* Footer Vibe */}
      <div style={{ 
        marginTop: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: '#333' 
      }}>
        <ChefHat size={16} />
        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Crafted for Foodies
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}