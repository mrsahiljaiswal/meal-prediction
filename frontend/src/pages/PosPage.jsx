import { useEffect, useMemo, useState } from "react";
import { fetchMeals, placeOrder } from "../api";

export default function PosPage() {
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState("");

  useEffect(() => {
    setMealsLoading(true);
    setMealsError("");
    fetchMeals()
      .then((res) => setMeals(res.data))
      .catch((err) => {
        const backendMsg =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message;
        setMealsError(
          typeof backendMsg === "string"
            ? backendMsg
            : "Failed to load meals. Please check backend."
        );
      })
      .finally(() => setMealsLoading(false));
  }, []);

  const addToCart = (meal) => {
    setCart((prev) => ({
      ...prev,
      [meal.id]: {
        meal,
        quantity: (prev[meal.id]?.quantity || 0) + 1,
      },
    }));
  };

  const updateQuantity = (mealId, value) => {
    const quantity = Math.max(0, Number(value) || 0);
    setCart((prev) => {
      if (quantity === 0) {
        const next = { ...prev };
        delete next[mealId];
        return next;
      }
      return {
        ...prev,
        [mealId]: {
          ...prev[mealId],
          quantity,
        },
      };
    });
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.meal.checkoutPrice * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setLoading(true);
    setStatus("");
    try {
      const payload = {
        items: cartItems.map((item) => ({
          mealId: item.meal.id,
          quantity: item.quantity,
        })),
      };
      const response = await placeOrder(payload);
      setStatus(
        `Order #${response.data.orderId} placed successfully. Total: ${response.data.totalAmount.toFixed(
          2
        )}`
      );
      setCart({});
    } catch {
      setStatus("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
        <h2 className="mb-4 text-xl font-semibold">Available Meals</h2>
        {mealsLoading && <p className="text-sm text-slate-500">Loading...</p>}
        {mealsError && <p className="mb-3 text-sm text-red-600">{mealsError}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {!mealsLoading && meals.length === 0 && (
            <p className="col-span-full text-sm text-slate-500">
              No meals found in the database. Restart backend data loader.
            </p>
          )}
          {meals.map((meal) => (
            <button
              key={meal.id}
              onClick={() => addToCart(meal)}
              className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-400 hover:shadow"
            >
              <p className="text-lg font-medium">{meal.name}</p>
              <p className="mt-2 text-sm text-slate-500">Meal ID: {meal.id}</p>
              <p className="mt-1 text-indigo-700">
                ${Number(meal.checkoutPrice).toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Cart</h2>
        <div className="space-y-3">
          {cartItems.length === 0 && (
            <p className="text-sm text-slate-500">No items added yet.</p>
          )}
          {cartItems.map((item) => (
            <div
              key={item.meal.id}
              className="rounded-lg border border-slate-200 p-3"
            >
              <p className="font-medium">{item.meal.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.meal.id, e.target.value)}
                  className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                />
                <span className="text-sm font-medium text-slate-700">
                  ${(item.quantity * item.meal.checkoutPrice).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading || !cartItems.length}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
          {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
        </div>
      </section>
    </div>
  );
}
