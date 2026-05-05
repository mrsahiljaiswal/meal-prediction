import { Search, Bell, Settings, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '@/src/context/ThemeContext';

export default function TopBar({ title, subtitle, showSearch = true }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-surface/60 backdrop-blur-3xl sticky top-0 z-50 shadow-[0_0_32px_rgba(255,255,255,0.04)] flex justify-between items-center w-full px-8 py-6 border-b border-white/5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tighter font-headline">{title}</h2>
          {subtitle && <p className="text-sm text-on-surface-variant font-medium">{subtitle}</p>}
        </div>
        
        {showSearch && (
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input 
              className="bg-surface-container-highest border-none rounded-full py-2.5 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant transition-all" 
              placeholder="Search menu..." 
              type="search"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-all active:scale-95"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button className="p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-all active:scale-95">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-all active:scale-95">
          <Settings className="w-5 h-5" />
        </button>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="h-10 w-10 rounded-full overflow-hidden border-2 border-surface-container-highest cursor-pointer ml-2"
        >
          <img 
            alt="Staff Avatar" 
            className="object-cover w-full h-full" 
            src="https://picsum.photos/seed/chef/200/200" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </header>
  );
}
