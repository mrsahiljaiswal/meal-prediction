import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2, UserPlus, ShoppingCart } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Sidebar from '@/src/components/Sidebar';
import TopBar from '@/src/components/TopBar';



const MENU_ITEMS = [
  {
    id: 1,
    name: "Truffle Parm Fries",
    price: 12.50,
    description: "Golden fries tossed in white truffle oil and aged parmesan cheese.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjyHqytTyyCf9dk1KUgCUWv0EyKzykSS-80FZBHnmpj0Z_-gtHmN7aFy5reWv_Dm2v_LT4cnFrNHY0_phN-sGnykJ_m1HGVkThzvuBAHX8REfWk1AN5tuSFUWSKRF8cDz2vUZsdgyf3v8rZL9aSlryetYd6V5IrOmoMyAnuch_-WhQdHueg_Ul9JY0loxznrZYnkWqXX7VElhrM8nUn1leuF09h7AOuFdCK5qi2w1r0WhrNSXsbJaytOtNntPf4dZ56WqDzJkIj-bO",
  },
  {
    id: 2,
    name: "Gochujang Wings",
    price: 14.00,
    description: "Crispy wings glazed in sweet & spicy Korean chili sauce.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcJTDAi2qRPGd8dB1ytFaCdODrQn_8ljgSohSRK5lzx9GXtQIImIVdsqGZkc7rTumw7DWBEtpl53YGv8j51fRgExi3NqiGf4bHuc1MoAa9kF8BMSP79ay3YfiNAok1BK5m6o2KmHKHtBye-dfcdyRcNL2_UJjGxMauHxytMiXLPtIxHXjlvitjYcNZqYaO3LsgaUGcinkZ6KWn3jWuJNjANIXD4-gSssbdbVWLNLzG0UqUdBulrdkIGCvTFU0N-REVV61hd377lRgS",
  },
  {
    id: 3,
    name: "Avocado Harvest",
    price: 11.25,
    description: "Mixed greens, Haas avocado, and citrus vinaigrette.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEHeqrMjaGDf_IIXxLNN3Du1xvQ4-sLYkzGrPi7kdeVHQATJbFi-u76L-cR3xPQiOYNrFK-c_5QKSibbEI5uh2jdpIKwoViidLb6qtaaqlIPxzrY0re-YAwFG_6hkAZJAmgAk0NnPekzokS6MqRokQJhKsrz_HXNucBVQpR_fMO4KfBCv3tWzVwqFPxgSUdj9HN6QKERD9O2q4aWU4w5dypeSYan2f4bHRSECtCzTlalsif4yJpCkM46hV9bjCEvjz5_KMLcc06r8c",
  },
  {
    id: 4,
    name: "Salt & Pepper Squid",
    price: 16.50,
    description: "Lightly battered squid with garlic chips and chili flakes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUougOGdE_pQp3TDTbliLjElhTh_4kxYw9WfJHrHjn9xaKcZF5iOLlxPS4LaoLYj1pPI-mA8Kv9RwjF0MkueqAwYF16x8zkmTgcF9QaDJHFeDad7HV_2DOsGTJFVblAqHbbxbHxk5febqfi3VIfHJBWKtCjiCILUFfH6ZG587JaN5d_cZHtRaJhoHrDQCbtPUt6OTkI0dGeUyNFpBKg6OZcx-icDd7Y_IDrgy884pEmG0X_7raYKPkkNibt7oLX1astBF__QYUL09X",
  },
  {
    id: 5,
    name: "Classic Bruschetta",
    price: 9.75,
    description: "Roma tomatoes, basil, and extra virgin olive oil on sourdough.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0HPbsWYD1mLA7SMZKdmsaH-mh1PE_xbdVni6aoRYXzxXvkwvhbAudekv0rgok-z1emi-8_QbR0-6bSinZt_Odi_wF-_keCMeQs6wcsD6JPygxKjPSATAHjE1TPdgckrCwOpE5B58qQioFHY8nN29-ldlVXFDMqbCfsMZbVHd7PwKCJ4WxcIObJQvLDV5ashjN8jhb3CP07zi0Xji5f40tuVR5K1Tkkj30YlVUfQXra_LAHrjHztgW4oNO8pPAdsP6vDxmyL2Jsrls",
  }
];

export default function DashboardScreen() {
  const [order, setOrder] = useState([
    { id: 1, name: "Truffle Parm Fries", price: 12.50, quantity: 1, notes: "No Parsley" },
    { id: 2, name: "Gochujang Wings", price: 14.00, quantity: 2, notes: "Extra Spicy" },
    { id: 3, name: "Avocado Harvest", price: 11.25, quantity: 1 },
  ]);

  const subtotal = order.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.1;
  const tax = subtotal * 0.08;
  const total = subtotal + serviceCharge + tax;

  const updateQuantity = (id, delta) => {
    setOrder(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const addToOrder = (item) => {
    setOrder(prev => {
      const existing = prev.find(o => o.id === item.id);
      if (existing) {
        return prev.map(o => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      
      <main className="ml-20 lg:ml-64 flex-1 flex flex-col bg-surface-dim overflow-hidden relative">
        <TopBar title="Luminescent POS" />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar lg:pr-[400px]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Appetizers</h3>
              <p className="text-on-surface-variant font-medium">Handcrafted starters for the soul.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 rounded-full bg-surface-container-highest text-sm font-bold border border-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-all">Recent</button>
              <button className="px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-black border border-primary/20 shadow-lg shadow-primary/5">Popular</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MENU_ITEMS.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -4 }}
                className="group bg-surface-container-low rounded-[2rem] overflow-hidden p-3 transition-all hover:bg-surface-container-high relative border border-white/5"
              >
                <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-4">
                  <img 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={item.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <span className="absolute top-4 right-4 bg-primary text-on-primary font-black text-xs px-3 py-1.5 rounded-full shadow-lg">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="px-3 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-black font-headline tracking-tight">{item.name}</h4>
                    <button 
                      onClick={() => addToOrder(item)}
                      className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all scale-95 active:scale-90 shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="hidden lg:flex fixed top-0 right-0 w-[380px] h-full glass-panel border-l border-white/5 flex-col z-50">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black font-headline tracking-tight">Current Order</h3>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all">
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl mb-8 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center font-black text-on-primary font-headline text-xl">T4</div>
              <div>
                <p className="text-base font-bold">Table 04</p>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">James R. • 2 Guests</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 space-y-6 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {order.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id} 
                  className="group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-sm font-bold">{item.name}</h5>
                      {item.notes && <p className={cn("text-[10px] font-bold mt-1", item.notes.includes('Extra') ? "text-secondary" : "text-on-surface-variant")}>{item.notes}</p>}
                    </div>
                    <p className="text-sm font-black font-headline">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-surface-container-highest rounded-xl p-1 shadow-inner">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-primary hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-primary hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button className="text-[10px] text-primary/80 hover:text-primary font-black uppercase tracking-widest transition-colors">Edit Notes</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-8 bg-surface-container-lowest/40 backdrop-blur-xl border-t border-white/5 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                <span>Service Charge (10%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Total Amount</p>
                <p className="text-5xl font-black font-headline text-on-surface tracking-tighter">
                  <span className="text-2xl text-primary-dim mr-1 font-medium font-sans">$</span>
                  {total.toFixed(2)}
                </p>
              </div>
            </div>
            
            <button className="w-full h-18 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-black text-xl rounded-2xl shadow-[0_12px_32px_-8px_rgba(255,143,115,0.4)] flex items-center justify-center gap-3 transition-all hover:shadow-primary/40 active:scale-[0.98]">
              <ShoppingCart className="w-6 h-6" />
              Checkout
            </button>
          </div>
        </aside>

        <button className="fixed bottom-8 right-8 lg:right-[410px] w-16 h-16 bg-white text-surface-dim rounded-full shadow-2xl flex items-center justify-center group transition-all hover:scale-110 active:scale-90 z-40">
          <Plus className="w-8 h-8 font-bold transition-transform group-hover:rotate-90" />
          <span className="absolute right-full mr-4 bg-white text-surface-dim px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-black/5">Add New Item</span>
        </button>
      </main>
    </div>
  );
}
