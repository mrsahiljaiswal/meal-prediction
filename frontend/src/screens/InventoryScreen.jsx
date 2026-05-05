import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Clock, 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Truck, 
  MoreVertical,
  ChevronRight,
  Target,
  Search
} from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';
import TopBar from '@/src/components/TopBar';
import { cn } from '@/src/lib/utils';

const predictiveData = [
  { name: 'Poultry', change: '+20%', trend: 'up', conf: '92%', status: 'High weekend velocity', image: 'https://picsum.photos/seed/chicken/100/100' },
  { name: 'Salads', change: '-5%', trend: 'down', conf: '78%', status: 'Cooling weather effect', image: 'https://picsum.photos/seed/salad/100/100' },
  { name: 'Artisan Cheese', change: '+34%', trend: 'up', conf: '85%', status: 'Tasting event demand', image: 'https://picsum.photos/seed/cheese/100/100' },
  { name: 'Desserts', change: '0%', trend: 'stable', conf: '98%', status: 'Consistent performance', image: 'https://picsum.photos/seed/cake/100/100' },
];

export default function InventoryScreen() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      
      <main className="ml-20 lg:ml-64 flex-1 flex flex-col bg-surface-dim overflow-y-auto p-8 custom-scrollbar">
        <header className="bg-surface/60 backdrop-blur-3xl sticky top-0 z-50 flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-primary font-headline tracking-tighter">Inventory Forecasting</h2>
            <p className="text-sm text-on-surface-variant font-bold mt-1 uppercase tracking-widest">AI-driven supply chain insights</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input className="bg-surface-container-highest border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-1 focus:ring-primary w-72 transition-all placeholder:text-on-surface-variant" placeholder="Search inventory..." type="text"/>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                <img className="w-full h-full object-cover rounded-full" src="https://picsum.photos/seed/manager/100/100" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-10">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ x: 4 }}
              className="bg-error-container/5 border-l-4 border-error p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-error-container/10 transition-all shadow-lg"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-error/20 flex items-center justify-center text-error shadow-lg shadow-error/10">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-error font-headline tracking-tight text-lg">Critical Stock Alert</h4>
                  <p className="text-sm text-on-surface-variant font-medium">Wagyu Ribeye (A5) is below 15% threshold.</p>
                </div>
              </div>
              <button className="px-6 py-2.5 bg-error text-on-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-error/20 active:scale-95 transition-transform">Restock Now</button>
            </motion.div>

            <motion.div 
              whileHover={{ x: 4 }}
              className="bg-primary-container/5 border-l-4 border-primary p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-primary-container/10 transition-all shadow-lg"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-primary font-headline tracking-tight text-lg">Upcoming Shortage</h4>
                  <p className="text-sm text-on-surface-variant font-medium">Organic Kale expected to deplete in 48 hours.</p>
                </div>
              </div>
              <button className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">Schedule</button>
            </motion.div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-surface-container rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl border border-white/5">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-[0.35em] text-secondary opacity-80 mb-2 block">Global Pulse</span>
                    <h3 className="text-5xl font-black font-headline tracking-tighter">Stock Health Index</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-7xl font-black text-secondary font-headline italic tracking-tighter drop-shadow-[0_0_20px_rgba(92,253,128,0.3)]">94%</span>
                    <p className="text-xs text-on-surface-variant mt-2 font-black uppercase tracking-widest">Optimal Range</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <HealthBar label="Premium Proteins" current={42} total={50} color="secondary" />
                  <HealthBar label="Fresh Produce" current={112} total={200} color="primary" />
                  <HealthBar label="Dry Goods" current={880} total={1000} color="secondary" />
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            <div className="lg:col-span-4 glass-panel border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl">
              <div>
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 shadow-lg shadow-primary/5"
                >
                  <BrainCircuit className="w-8 h-8" />
                </motion.div>
                <h4 className="text-3xl font-black font-headline mb-4 tracking-tight">AI Forecast</h4>
                <p className="text-on-surface-variant font-medium leading-relaxed text-lg">
                  System predicts a <span className="text-secondary font-black">12% surge</span> in overall demand due to the upcoming Jazz Festival weekend.
                </p>
              </div>
              <div className="mt-10">
                <div className="p-6 bg-surface-container-low rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                  <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                    <Target className="w-3 h-3" /> Recommendation
                  </p>
                  <p className="font-bold italic text-on-surface leading-relaxed">
                    "Increase dairy par-levels by 15% starting Thursday morning."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-4xl font-black font-headline tracking-tighter">Predicted Demand</h3>
                <p className="text-on-surface-variant font-bold mt-1 uppercase tracking-widest text-xs">Upcoming 7-day algorithmic trajectory</p>
              </div>
              <button className="text-primary font-black flex items-center gap-2 hover:translate-x-1 transition-transform uppercase text-xs tracking-widest">
                Detailed Report <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {predictiveData.map((item) => (
                <div key={item.name} className="bg-surface-container rounded-[2rem] p-6 hover:translate-y-[-8px] transition-all duration-300 border border-white/5 shadow-xl hover:shadow-primary/5">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 p-0.5">
                      <img className="w-full h-full object-cover rounded-xl" src={item.image} referrerPolicy="no-referrer" />
                    </div>
                    <span className={cn(
                      "font-black text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm border",
                      item.trend === 'up' ? "bg-secondary/10 text-secondary border-secondary/20" :
                      item.trend === 'down' ? "bg-primary/10 text-primary border-primary/20" :
                      "bg-surface-container-highest text-on-surface-variant border-outline-variant/20"
                    )}>
                      {item.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                      {item.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                      {item.change}
                    </span>
                  </div>
                  <h5 className="font-black text-xl mb-1 tracking-tight">{item.name}</h5>
                  <p className="text-xs text-on-surface-variant font-bold mb-8 uppercase tracking-widest">{item.status}</p>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest">Conf. Level</span>
                    <span className={cn(
                      "text-xs font-black",
                      parseInt(item.conf) > 90 ? "text-secondary" : "text-primary"
                    )}>{item.conf}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border border-white/5">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black font-headline tracking-tighter text-on-surface">Upcoming Deliveries</h3>
              <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-2xl border border-white/5">
                <button className="px-6 py-2 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Today</button>
                <button className="px-6 py-2 hover:bg-surface-container-highest transition-colors rounded-xl text-xs font-black uppercase tracking-widest text-on-surface-variant">This Week</button>
              </div>
            </div>
            <div className="space-y-4">
              <DeliveryItem 
                vendor="Ocean Harvest Seafood" 
                po="#88291" 
                eta="14:30 Today" 
                status="IN TRANSIT" 
                statusColor="secondary"
              />
              <DeliveryItem 
                vendor="Prime Butcher Co." 
                po="#88304" 
                eta="Tomorrow 06:00" 
                status="PROCESSING" 
                statusColor="neutral"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function HealthBar({ label, current, total, color }) {
  const percentage = (current / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-base mb-4">
        <span className="font-bold text-on-surface">{label}</span>
        <span className="text-on-surface-variant font-bold font-headline">{current} / {total} units</span>
      </div>
      <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={cn(
            "h-full rounded-full shadow-lg relative",
            color === 'secondary' ? "bg-secondary shadow-secondary/20" : "bg-primary shadow-primary/20"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
}

function DeliveryItem({ vendor, po, eta, status, statusColor }) {
  return (
    <div className="group grid grid-cols-12 gap-6 p-6 items-center bg-surface-container-low rounded-[1.5rem] border border-transparent hover:border-primary/20 transition-all shadow-md">
      <div className="col-span-12 md:col-span-5 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary shadow-inner border border-white/5 group-hover:bg-primary group-hover:text-on-primary transition-all">
          <Truck className="w-7 h-7" />
        </div>
        <div>
          <h6 className="font-black text-lg tracking-tight">{vendor}</h6>
          <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">{po}</p>
        </div>
      </div>
      <div className="col-span-12 md:col-span-3">
        <span className="text-[10px] text-on-surface-variant block mb-1 uppercase font-black tracking-widest">ETA</span>
        <span className="text-base font-bold text-on-surface">{eta}</span>
      </div>
      <div className="col-span-12 md:col-span-2">
        <span className="text-[10px] text-on-surface-variant block mb-1 uppercase font-black tracking-widest">Status</span>
        <span className={cn(
          "text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border",
          statusColor === 'secondary' 
            ? "bg-secondary/10 text-secondary border-secondary/20 shadow-sm shadow-secondary/5" 
            : "bg-surface-container-highest text-on-surface-variant border-white/10"
        )}>
          {status}
        </span>
      </div>
      <div className="col-span-12 md:col-span-2 text-right">
        <button className="p-3 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5 rounded-xl">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
