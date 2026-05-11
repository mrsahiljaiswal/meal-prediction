import { useEffect, useMemo, useState } from "react";
import { fetchMeals, placeOrder } from "../api";

const getImageForMeal = (mealName) => {
  if (!mealName)
    return "https://images.unsplash.com/photo-1495474472205-16284eb8703e?w=600&q=80";
  const name = mealName.toLowerCase();
  if (name.includes("beverage"))
    return "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80";
  if (name.includes("sandwich"))
    return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80";
  if (name.includes("desert") || name.includes("dessert"))
    return "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80";
  if (name.includes("salad"))
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80";
  if (name.includes("pizza"))
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80";
  if (name.includes("pasta"))
    return "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80";
  if (name.includes("rice") || name.includes("biryani"))
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80";
  if (name.includes("soup"))
    return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80";
  if (name.includes("seafood") || name.includes("fish"))
    return "https://images.unsplash.com/photo-1615141982883-c7da0e69f591?w=600&q=80";
  if (
    name.includes("snack") ||
    name.includes("starter") ||
    name.includes("extra")
  )
    return "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&q=80";
  return "https://images.unsplash.com/photo-1495474472205-16284eb8703e?w=600&q=80";
};

export default function PosPage() {
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [mealsLoading, setMealsLoading] = useState(true);

  useEffect(() => {
    fetchMeals()
      .then((res) => setMeals(res.data))
      .catch(() => setMeals([]))
      .finally(() => setMealsLoading(false));
  }, []);

  const addToCart = (meal) => {
    setCart((prev) => ({
      ...prev,
      [meal.id]: { meal, quantity: (prev[meal.id]?.quantity || 0) + 1 },
    }));
  };

  const updateQuantity = (mealId, delta) => {
    setCart((prev) => {
      const nextQty = (prev[mealId]?.quantity || 0) + delta;
      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[mealId];
        return next;
      }
      return { ...prev, [mealId]: { ...prev[mealId], quantity: nextQty } };
    });
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.meal.checkoutPrice * item.quantity,
        0,
      ),
    [cartItems],
  );
  const serviceCharge = subtotal * 0.1;
  const tax = subtotal * 0.08;
  const total = subtotal + serviceCharge + tax;

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setLoading(true);
    setStatus("");
    try {
      const response = await placeOrder({
        items: cartItems.map((i) => ({
          mealId: i.meal.id,
          quantity: i.quantity,
        })),
      });
      setStatus(`Success! Order #${response.data.orderId} placed.`);
      setCart({});
      setTimeout(() => setStatus(""), 4000);
    } catch {
      setStatus("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full pl-8 pb-8 gap-8">
      {/* Left Menu Area */}
      <section className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Appetizers
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Handcrafted starters for the soul.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full">
            <button className="px-5 py-1.5 text-sm font-semibold text-slate-500 rounded-full hover:bg-white hover:shadow-sm">
              Recent
            </button>
            <button className="px-5 py-1.5 text-sm font-semibold text-[#F0592A] bg-orange-50 rounded-full shadow-sm">
              Popular
            </button>
          </div>
        </div>

        {mealsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse pr-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 bg-white rounded-[2rem] shadow-sm"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 overflow-y-auto pr-4 pb-12 custom-scrollbar">
            {meals.map((meal) => {
              const imageUrl = getImageForMeal(meal.name);
              return (
                <div
                  key={meal.id}
                  className="group relative flex flex-col bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-slate-100 mb-4">
                    <img
                      src={imageUrl}
                      alt={meal.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-[#F0592A] text-white px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-md">
                      ${Number(meal.checkoutPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                      {meal.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 mb-4 line-clamp-2">
                      Golden fresh ingredients tossed in signature sauce and
                      spices.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => addToCart(meal)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-[#F0592A] transition-all hover:bg-[#F0592A] hover:text-white"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Right Cart Sidebar (Fixed) */}
      <section className="w-96 bg-[#FAFAFA] border-l border-slate-100 flex flex-col h-[calc(100vh-80px)] shrink-0 -mt-20 pt-20">
        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Current Order</h2>
            <div className="flex gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:text-rose-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:text-slate-800">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-[#F0592A] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-200">
              T4
            </div>
            <div>
              <p className="font-bold text-slate-800">Table 04</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                James R. • 2 Guests
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
            {cartItems.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm font-medium">
                Cart is empty
              </p>
            ) : (
              cartItems.map((item) => (
                <div key={item.meal.id} className="group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-sm text-slate-800">
                        {item.meal.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        No Parsley
                      </p>
                    </div>
                    <p className="font-bold text-sm text-slate-900">
                      ${Number(item.meal.checkoutPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-full px-1 py-1">
                      <button
                        onClick={() => updateQuantity(item.meal.id, -1)}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-slate-500 hover:bg-white hover:shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.meal.id, 1)}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-[#F0592A] hover:bg-white hover:shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <button className="text-[10px] font-bold text-[#F0592A] uppercase tracking-wider hover:underline">
                      Edit Notes
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-6 mt-4">
            <div className="space-y-2 mb-6 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (10%)</span>
                <span className="text-slate-800">
                  ${serviceCharge.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-slate-800">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Total Amount
              </p>
              <p className="text-4xl font-black text-slate-900 flex items-start gap-1">
                <span className="text-xl text-[#F0592A] mt-1">$</span>
                {total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !cartItems.length}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#F0592A] py-4 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-orange-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {loading ? "Processing..." : "Checkout"}
            </button>
            {status && (
              <p className="mt-3 text-center text-xs font-bold text-emerald-600">
                {status}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
