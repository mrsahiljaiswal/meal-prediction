import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Delete, CheckCircle2, ArrowRight, HelpingHand, Languages, Sun, Moon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const [pin, setPin] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleUnlock = () => {
    if (pin.length === 4 || employeeId.length > 0) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-surface text-on-surface overflow-hidden font-sans">
      <div className="fixed inset-0 z-0">
        <img 
          alt="Restaurant Background" 
          className="w-full h-full object-cover opacity-40 scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBorMniJuabx795PxuXFULkwSk2jD8lw6CltMMvEQ7kTFjFw1sjKKq3w6SN41LFVVuCLnbcIyq3pIVgeinsthsSf8RvRUHoU1irUCHykAu4rufVMVK2MefQShxs0ufZu0nRAaMSmKVlHY2Z5gHgwHgLrp0Gdc9_OLS7Hj80B3CUhQiSnnArb1AtddRd_wb3lmu1RthZ8r_4KdSXX9ZZf6mQqiTspNlIN7tPCqQeNSD_dwSal5NyljJKYQ_Oz7B96qq7SThnu6w-xSY0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/40 to-surface/90"></div>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-[480px] rounded-[2.5rem] p-10 flex flex-col items-center gap-8 shadow-[0_0_64px_rgba(0,0,0,0.5)] border border-white/5"
        >
          <div className="text-center space-y-2">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
              Luminescent POS
            </h1>
            <p className="text-on-surface-variant font-headline text-sm uppercase tracking-[0.2em] opacity-80">
              Terminal Access — Area 01
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-2">
              <label className="font-headline text-[10px] font-black tracking-widest text-on-surface-variant px-1 uppercase">EMPLOYEE ID</label>
              <div className="relative group">
                <input 
                  className="w-full bg-surface-container-highest/50 border-none rounded-xl py-5 px-6 font-headline text-xl focus:ring-0 focus:bg-surface-container-highest transition-all placeholder:text-outline" 
                  placeholder="Scan Badge or Enter ID" 
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-focus-within:w-full transition-all duration-500"></div>
              </div>
            </div>

            <div className="flex justify-center gap-4 py-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    scale: pin.length > i ? 1.2 : 1,
                    backgroundColor: pin.length > i ? '#ff8f73' : 'rgba(38, 38, 38, 0.5)'
                  }}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 border-outline-variant transition-colors",
                    pin.length > i ? "border-primary" : "border-outline-variant"
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button 
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="h-16 flex items-center justify-center rounded-2xl bg-surface-container/40 font-headline text-2xl font-bold hover:bg-surface-container-highest active:scale-95 transition-all text-on-surface border border-white/5"
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={handleBackspace}
                className="h-16 flex items-center justify-center rounded-2xl bg-error-container/20 text-error-dim hover:bg-error-container/40 active:scale-95 transition-all border border-error/10"
              >
                <Delete className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleNumberClick(0)}
                className="h-16 flex items-center justify-center rounded-2xl bg-surface-container/40 font-headline text-2xl font-bold hover:bg-surface-container-highest active:scale-95 transition-all text-on-surface border border-white/5"
              >
                0
              </button>
              <button 
                className="h-16 flex items-center justify-center rounded-2xl bg-secondary/10 text-secondary hover:bg-secondary/20 active:scale-95 transition-all border border-secondary/10"
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleUnlock}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline text-lg font-bold shadow-[0_12px_24px_-8px_rgba(255,143,115,0.4)] hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Unlock System
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6 pt-4 border-t border-white/5 w-full justify-center">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
              <HelpingHand className="w-4 h-4" />
              IT Support
            </button>
            <div className="h-1 w-1 rounded-full bg-outline-variant"></div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
              <Languages className="w-4 h-4" />
              English
            </button>
            <div className="h-1 w-1 rounded-full bg-outline-variant"></div>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-12 right-12 z-20 hidden md:block text-right">
        <p className="font-headline text-5xl font-black text-white/40 tracking-tighter">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
        <p className="font-headline text-[10px] text-on-surface-variant uppercase font-black tracking-[0.3em] opacity-60">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
