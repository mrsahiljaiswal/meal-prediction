import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  Utensils, 
  ForkKnife, 
  Wine, 
  IceCreamBowl, 
  LogOut, 
  PlusCircle, 
  ChefHat 
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const categories = [
  { name: 'Appetizers', icon: Utensils, active: true },
  { name: 'Mains', icon: ForkKnife },
  { name: 'Drinks', icon: Wine },
  { name: 'Desserts', icon: IceCreamBowl },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-20 lg:w-64 flex-col fixed left-0 top-0 z-40 bg-surface flex flex-col gap-8 p-4 border-r border-white/5">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
          <ChefHat className="w-6 h-6 text-primary" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-black text-on-surface font-headline tracking-tight">The Kitchen</h1>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Terminal 01</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow mt-4">
        <NavLink 
          to="/dashboard"
          className={({ isActive }) => cn(
            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
            isActive 
              ? "bg-gradient-to-r from-primary to-primary-dim text-white shadow-lg shadow-primary/20" 
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
          )}
        >
          <LayoutDashboard className="w-6 h-6 shrink-0" />
          <span className="hidden lg:block font-headline font-medium">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/analytics"
          className={({ isActive }) => cn(
            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
            isActive 
              ? "bg-gradient-to-r from-primary to-primary-dim text-white shadow-lg shadow-primary/20" 
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
          )}
        >
          <BarChart3 className="w-6 h-6 shrink-0" />
          <span className="hidden lg:block font-headline font-medium">Analytics</span>
        </NavLink>

        <NavLink 
          to="/inventory"
          className={({ isActive }) => cn(
            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
            isActive 
              ? "bg-gradient-to-r from-primary to-primary-dim text-white shadow-lg shadow-primary/20" 
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
          )}
        >
          <Package className="w-6 h-6 shrink-0" />
          <span className="hidden lg:block font-headline font-medium">Inventory</span>
        </NavLink>

        <div className="mt-8 pt-8 border-t border-outline-variant/10">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-4 mb-4 hidden lg:block">Categories</p>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                className={cn(
                  "flex items-center gap-4 p-4 transition-colors",
                  cat.active ? "text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <cat.icon className="w-6 h-6 shrink-0" />
                <span className="hidden lg:block font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <button className="w-full bg-surface-container-highest text-on-surface rounded-xl py-4 px-4 font-bold hidden lg:flex items-center justify-center gap-2 hover:bg-surface-bright transition-all active:scale-95 border border-white/5">
          <PlusCircle className="w-5 h-5 text-primary" />
          New Order
        </button>
        <Link 
          to="/"
          className="text-on-surface-variant hover:text-on-surface flex items-center gap-4 p-4 transition-all"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          <span className="hidden lg:block font-headline font-medium">Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
