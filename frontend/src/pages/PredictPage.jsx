import { useEffect, useMemo, useState } from "react";
import { fetchPrediction } from "../api";

const ingredientIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("milk") || lower.includes("cream")) return "water_drop";
  if (lower.includes("coffee") || lower.includes("tea")) return "coffee";
  if (lower.includes("rice") || lower.includes("pasta")) return "rice_bowl";
  if (lower.includes("cheese") || lower.includes("butter")) return "bakery_dining";
  if (lower.includes("chicken") || lower.includes("fish")) return "restaurant";
  return "inventory_2";
};

export default function PredictPage({ auth }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchPrediction(auth?.centerId);
      setRows(response.data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setRows([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load prediction data.",
      );
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.centerId) {
      handlePredict();
    }
  }, [auth?.centerId]);

  const summary = useMemo(() => {
    const totalNeed = rows.reduce(
      (sum, row) => sum + Number(row.predictedRequiredAmount || 0),
      0,
    );
    const reorderCount = rows.filter((row) => Number(row.amountToOrder) > 0).length;
    const currentStock = rows.reduce(
      (sum, row) => sum + Number(row.currentStockQuantity || 0),
      0,
    );
    return { totalNeed, reorderCount, currentStock };
  }, [rows]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-5 py-10 md:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-5xl text-on-surface">
            Supply Forecast
          </h1>
          <p className="mt-2 text-lg italic text-secondary">
            AI-driven ingredient demand for center {auth?.centerId}.
          </p>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="soft-button flex items-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined">
            shopping_cart_checkout
          </span>
          {loading ? "Analyzing..." : "Generate Purchase Orders"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
        <div className="soft-card p-7">
          <div className="mb-6 flex items-start justify-between">
            <span className="material-symbols-outlined text-primary">
              trending_up
            </span>
            <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed-variant">
              Live
            </span>
          </div>
          <p className="text-sm font-semibold text-secondary">Predicted Need</p>
          <p className="font-serif text-3xl text-on-surface">
            {summary.totalNeed.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            units
          </p>
        </div>

        <div className="soft-card border-l-8 border-secondary p-7">
          <div className="mb-6 flex items-start justify-between">
            <span className="material-symbols-outlined text-secondary">
              warning
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              {summary.reorderCount} Critical
            </span>
          </div>
          <p className="text-sm font-semibold text-secondary">Stock-out Risks</p>
          <p className="font-serif text-3xl text-on-surface">High Priority</p>
        </div>

        <div className="soft-card bg-tertiary-fixed/50 p-7">
          <div className="mb-6 flex items-start justify-between">
            <span className="material-symbols-outlined text-tertiary">
              psychology
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-tertiary">
              ML
            </span>
          </div>
          <p className="text-sm font-semibold text-tertiary">Forecast Basis</p>
          <p className="font-serif text-3xl text-tertiary">Next Week</p>
        </div>

        <div className="soft-card flex flex-col items-center justify-center border-dashed p-7 text-center">
          <span className="material-symbols-outlined mb-3 rounded-full bg-secondary-container p-3 text-secondary">
            tune
          </span>
          <p className="font-semibold">Current stock</p>
          <p className="text-sm text-on-surface-variant">
            {summary.currentStock.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            units
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-surface-container" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="soft-card flex min-h-[320px] items-center justify-center p-8 text-center text-sm font-semibold text-on-surface-variant">
          {!hasSearched
            ? "Ready to predict. Click Generate Purchase Orders."
            : error || "No prediction data found for this center."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((row, index) => {
            const current = Number(row.currentStockQuantity || 0);
            const predicted = Number(row.predictedRequiredAmount || 0);
            const amountToOrder = Number(row.amountToOrder || 0);
            const fill = predicted > 0 ? Math.min(100, (current / predicted) * 100) : 0;
            const urgent = amountToOrder > 0;

            return (
              <div
                key={`${row.ingredientName}-${index}`}
                className="soft-card flex flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div>
                  <div className="mb-5 flex items-start justify-between">
                    <span className="material-symbols-outlined rounded-2xl bg-surface-container-low p-3 text-primary">
                      {ingredientIcon(row.ingredientName)}
                    </span>
                    <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-secondary">
                      {urgent ? "Reorder" : "Stocked"}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-on-surface">
                    {row.ingredientName}
                  </h3>
                  <p className="mb-6 mt-1 text-sm italic text-secondary">
                    Center {auth?.centerId} inventory
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Current Stock</span>
                      <span className="font-bold text-on-surface">
                        {current.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className={`h-full rounded-full ${urgent ? "bg-secondary" : "bg-primary"}`}
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                    <div className="flex justify-between border-t border-outline-variant/30 pt-4 text-sm">
                      <span className="flex items-center gap-1 italic text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">
                          auto_awesome
                        </span>
                        AI Demand
                      </span>
                      <span className="font-bold text-primary">
                        {predicted.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-end justify-between border-t border-dashed border-outline-variant/40 pt-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      To Order
                    </p>
                    <p className={`font-serif text-3xl ${urgent ? "text-secondary" : "text-primary"}`}>
                      +{amountToOrder.toFixed(1)}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined rounded-full p-2 ${urgent ? "bg-secondary-container text-secondary" : "bg-primary-fixed text-primary"}`}>
                    add
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
