import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  MonitorPlay,
  ShoppingBag,
  Users,
  XCircle,
  Sparkles
} from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';
import TopBar from '@/src/components/TopBar';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const data = [
  { name: 'Oct 01', revenue: 2500, growth: 2100 },
  { name: 'Oct 08', revenue: 3200, growth: 2800 },
  { name: 'Oct 15', revenue: 5420, growth: 4200 },
  { name: 'Oct 22', revenue: 4100, growth: 3800 },
  { name: 'Oct 31', revenue: 6200, growth: 5500 },
];

const categories = [
  { name: 'Main Course', amount: 62400, percentage: 85 },
  { name: 'Beverages', amount: 38120, percentage: 55 },
  { name: 'Appetizers', amount: 28950, percentage: 40 },
  { name: 'Desserts', amount: 13380, percentage: 20 },
];

const transactions = [
  { id: '#ORD-9402', server: 'Marcus J.', initial: 'MJ', table: 'Table 12', status: 'COMPLETED', time: 'Oct 31, 09:42 PM', amount: 156.50 },
  { id: '#ORD-9401', server: 'Sarah L.', initial: 'SL', table: 'Bar 04', status: 'COMPLETED', time: 'Oct 31, 09:38 PM', amount: 42.00 },
  { id: '#ORD-9400', server: 'Marcus J.', initial: 'MJ', table: 'Table 02', status: 'VOIDED', time: 'Oct 31, 09:30 PM', amount: 88.20 },
  { id: '#ORD-9399', server: 'Kevin C.', initial: 'KC', table: 'Table 21', status: 'COMPLETED', time: 'Oct 31, 09:22 PM', amount: 210.45 },
  { id: '#ORD-9398', server: 'Sarah L.', initial: 'SL', table: 'Table 18', status: 'COMPLETED', time: 'Oct 31, 09:15 PM', amount: 64.10 },
];

export default function AnalyticsScreen() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      
      <main className="ml-20 lg:ml-64 flex-1 flex flex-col bg-surface-dim overflow-y-auto p-8 custom-scrollbar">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Historical Sales</h1>
            <p className="text-on-surface-variant text-sm mt-1 font-medium">Detailed performance tracking and transaction logs.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex p-1 bg-surface-container rounded-xl border border-white/5">
              <button className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface rounded-lg transition-all">Daily</button>
              <button className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface rounded-lg transition-all">Weekly</button>
              <button className="px-5 py-2 text-sm font-black bg-surface-container-highest text-primary rounded-lg shadow-sm border border-white/5">Monthly</button>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant/10 cursor-pointer hover:bg-surface-container-highest transition-all">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Oct 1 - Oct 31, 2023</span>
            </div>
            <button className="bg-surface-container-high p-2.5 rounded-xl text-on-surface-variant hover:text-on-surface border border-outline-variant/10 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Gross Revenue" value="$142,850.00" trend="+12.5%" icon={MonitorPlay} color="primary" />
          <KPICard title="Total Orders" value="4,281" trend="+8.2%" icon={ShoppingBag} color="secondary" />
          <KPICard title="Average Ticket" value="$33.36" trend="+4.1%" icon={Users} color="tertiary" />
          <KPICard title="Voids/Loss" value="$1,102.45" trend="-2.4%" icon={XCircle} color="error" negative />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight">Revenue Trajectory</h3>
                <p className="text-sm text-on-surface-variant font-medium">Performance over the selected period</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(255,143,115,0.4)]"></span> Revenue
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <span className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(92,253,128,0.4)]"></span> Growth
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8f73" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff8f73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-outline-variant/20" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="currentColor" 
                    className="text-outline"
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                    fontWeight="500"
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#262626', 
                      border: '1px solid rgba(255,143,115,0.2)', 
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ff8f73" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 flex flex-col">
            <h3 className="text-2xl font-black font-headline tracking-tight mb-8">Top Categories</h3>
            <div className="space-y-8 flex-grow">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-on-surface">{cat.name}</span>
                    <span className="text-secondary font-black">${cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-5 bg-secondary-container/10 rounded-2xl border border-secondary/20 shadow-lg shadow-secondary/5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-xs font-bold text-on-surface leading-normal">
                  Insights: <span className="text-secondary">"Main Course"</span> sales are up 15% due to the new dinner specials.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container/30 border-b border-white/5">
            <div>
              <h3 className="text-2xl font-black font-headline tracking-tight">Recent Transactions</h3>
              <p className="text-sm text-on-surface-variant font-medium">Real-time update of all finalized orders</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input 
                className="bg-surface-container-highest border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary w-full md:w-72 transition-all placeholder:text-on-surface-variant" 
                placeholder="Search orders..." 
                type="text"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] bg-surface-container-low border-b border-white/5">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Server</th>
                  <th className="px-8 py-5">Table</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5">Date & Time</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {transactions.map((t, i) => (
                  <tr key={t.id} className={cn(
                    "hover:bg-surface-container-highest/50 transition-colors group",
                    i % 2 === 0 ? "bg-surface-container-low/40" : "bg-transparent"
                  )}>
                    <td className="px-8 py-5 font-mono text-primary font-bold">{t.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-black border border-white/10 group-hover:border-primary/30 transition-colors">
                          {t.initial}
                        </div>
                        <span className="font-bold">{t.server}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-medium">{t.table}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black shadow-sm",
                        t.status === 'COMPLETED' 
                          ? "bg-secondary/10 text-secondary border border-secondary/20" 
                          : "bg-error/10 text-error border border-error/20"
                      )}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-on-surface-variant font-medium">{t.time}</td>
                    <td className={cn(
                      "px-8 py-5 text-right font-black font-headline text-base",
                      t.status === 'VOIDED' ? "text-error" : "text-on-surface"
                    )}>
                      ${t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface-container-high/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Showing 1-10 of 4,281 transactions</span>
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright transition-all border border-white/5 active:scale-95">
                <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button className="p-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright transition-all border border-white/5 active:scale-95">
                <ChevronRight className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color, negative = false }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-6 rounded-[2rem] border border-white/5 shadow-xl"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "p-3 rounded-2xl shadow-lg",
          color === 'primary' ? "bg-primary/10 text-primary shadow-primary/10" :
          color === 'secondary' ? "bg-secondary/10 text-secondary shadow-secondary/10" :
          color === 'tertiary' ? "bg-primary/10 text-primary shadow-primary/10" :
          "bg-error/10 text-error shadow-error/10"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={cn(
          "flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm",
          negative 
            ? "bg-error/10 text-error border-error/20" 
            : "bg-secondary/10 text-secondary border-secondary/20"
        )}>
          {trend} 
          {negative ? <TrendingDown className="w-3.5 h-3.5 ml-1" /> : <TrendingUp className="w-3.5 h-3.5 ml-1" />}
        </span>
      </div>
      <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black font-headline mt-1 tracking-tight text-on-surface">{value}</p>
    </motion.div>
  );
}
