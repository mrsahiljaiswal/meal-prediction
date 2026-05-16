import { useEffect, useMemo, useState } from "react";
import { fetchMeals, placeOrder } from "../api";

const fallbackImage =
  "https://images.unsplash.com/photo-1495474472205-16284eb8703e?w=600&q=80";

const mealImageMap = {
  "Vegetarian Thali":
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",

  "Veggie Rice Bowl":
    "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg",

  "Paneer Curry Veg":
    "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg",

  "Mixed Vegetable Curry":
    "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",

  "Mushroom Masala":
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",

  "Spinach Dal Fry":
    "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg",

  "Paneer Tikka":
    "https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg",

    "Chana Masala":
    "https://images.pexels.com/photos/5560765/pexels-photo-5560765.jpeg",
  
  "Kadai Vegetable":
  "https://images.pexels.com/photos/5410418/pexels-photo-5410418.jpeg",
  
  "Dal Makhani":
  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
  
  "Jeera Rice":
  "https://images.pexels.com/photos/4187620/pexels-photo-4187620.jpeg",
  
  "Aloo Gobi":
  "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg",
  
  "Matar Paneer":
  "https://images.pexels.com/photos/5410401/pexels-photo-5410401.jpeg",
  
  "Veg Noodles":
  "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
  
  "Masala Dosa":
  "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg"
};

const getImageForMeal = (mealName) => {
  if (!mealName) return fallbackImage;
  const name = mealName;
  return mealImageMap[name];
};

const getMealImageUrl = (meal) =>
  meal?.imageUrl?.trim() || getImageForMeal(meal?.name);

const getCategory = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("coffee") || lower.includes("tea") || lower.includes("cooler") || lower.includes("lassi")) return "Drinks";
  if (lower.includes("brownie") || lower.includes("jamun") || lower.includes("rasmalai")) return "Sweets";
  if (lower.includes("starter") || lower.includes("snack") || lower.includes("fries")) return "Bites";
  return "Mains";
};

export default function PosPage({ auth }) {
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState("");

  useEffect(() => {
    setMealsLoading(true);
    setMealsError("");
    fetchMeals(auth.centerId)
      .then((res) => setMeals(res || []))
      .catch((err) => {
        console.error(err);
        setMeals([]);
        setMealsError(err?.message || "Failed to load meals.");
      })
      .finally(() => setMealsLoading(false));
  }, [auth.centerId]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.meal.checkoutPrice * item.quantity,
        0,
      ),
    [cartItems],
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

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

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setLoading(true);
    setStatus("");
    try {
      const response = await placeOrder(
        {
          items: cartItems.map((i) => ({
            mealId: i.meal.id,
            quantity: i.quantity,
          })),
        },
        auth.centerId,
        auth.empId,
      );
      setStatus(`Order #${response.orderId} placed beautifully.`);
      setCart({});
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Checkout failed. Check inventory for this center.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col overflow-hidden lg:flex-row">
      <section className="flex-1 overflow-y-auto p-5 md:p-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-5xl text-on-surface">
              Menu Terminal
            </h1>
            <p className="mt-2 text-lg italic text-secondary">
              Select items for center {auth.centerId}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["All", "Mains", "Drinks", "Bites"].map((category, index) => (
              <button
                key={category}
                className={
                  index === 0
                    ? "rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary shadow-soft"
                    : "muted-button"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {mealsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-surface-container" />
            ))}
          </div>
        ) : mealsError ? (
          <div className="soft-card flex h-72 items-center justify-center text-center font-semibold text-error">
            {mealsError}
          </div>
        ) : meals.length === 0 ? (
          <div className="soft-card flex h-72 items-center justify-center text-center font-semibold text-on-surface-variant">
            No meals configured for center {auth.centerId}.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {meals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => addToCart(meal)}
                className="group soft-card flex flex-col p-4 text-left transition hover:-translate-y-1 hover:shadow-lift active:scale-[0.99]"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-surface-container">
                  <img
                    src={getMealImageUrl(meal)}
                    alt={meal.name}
                    onError={(event) => {
                      event.currentTarget.src = getImageForMeal(meal.name);
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <span className="mb-2 w-fit rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                    {getCategory(meal.name)}
                  </span>
                  <h3 className="font-serif text-2xl leading-tight text-on-surface">
                    {meal.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="font-serif text-2xl text-primary">
                      ${Number(meal.checkoutPrice).toFixed(2)}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-soft transition group-hover:scale-110">
                      <span className="material-symbols-outlined">add</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <aside className="flex max-h-[calc(100vh-80px)] flex-col border-l border-outline-variant bg-surface-container-low lg:w-[34%] xl:w-[30%]">
        <div className="border-b border-outline-variant bg-background p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl">Current Order</h2>
              <p className="mt-1 text-sm italic text-secondary">
                Center {auth.centerId} • Staff {auth.empId}
              </p>
            </div>
            <button
              onClick={() => setCart({})}
              className="rounded-full px-3 py-1 text-sm font-semibold italic text-error transition hover:bg-error-container"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="order-scroll flex-1 space-y-6 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <p className="py-16 text-center text-sm font-semibold italic text-on-surface-variant">
              Cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.meal.id} className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-serif text-xl text-on-surface">
                    {item.meal.name}
                  </h4>
                  <p className="text-sm italic text-secondary">
                    {getCategory(item.meal.name)}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-outline-variant bg-surface-container p-1">
                  <button
                    onClick={() => updateQuantity(item.meal.id, -1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      remove
                    </span>
                  </button>
                  <span className="w-6 text-center text-sm font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.meal.id, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-container-highest"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                  </button>
                </div>
                <span className="min-w-[72px] text-right font-serif text-xl text-primary">
                  ${(item.meal.checkoutPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-outline-variant bg-surface-container-high p-6">
          <div className="space-y-3 text-sm text-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/50 pt-4 font-serif text-3xl text-on-surface">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading || !cartItems.length}
            className="mt-6 flex w-full items-center justify-between rounded-2xl bg-primary px-6 py-4 font-serif text-2xl text-on-primary shadow-lift transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{loading ? "Charging..." : "Charge Order"}</span>
            <span>${total.toFixed(2)}</span>
          </button>
          {status && (
            <p className="mt-4 text-center text-sm font-semibold text-primary">
              {status}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
