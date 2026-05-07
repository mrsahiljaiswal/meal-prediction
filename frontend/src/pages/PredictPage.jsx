import { useState } from "react";
import { fetchPrediction } from "../api";

export default function PredictPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchPrediction();
      setRows(response.data);
      setHasSearched(true);
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message;
      setError(
        typeof backendMsg === "string"
          ? backendMsg
          : "Unable to fetch forecast. Ensure backend and ML API are running."
      );
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Inventory Forecasting Dashboard</h2>
          <p className="text-sm text-slate-500">
            Predict next week ingredient demand and required purchase amount.
          </p>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300"
        >
          {loading ? "Loading..." : "Get Next Week's Prediction"}
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-100 text-left text-sm uppercase tracking-wide text-slate-600">
              <th className="rounded-l-lg px-4 py-3">Ingredient</th>
              <th className="px-4 py-3">Current Stock</th>
              <th className="px-4 py-3">Predicted Need</th>
              <th className="rounded-r-lg px-4 py-3">Amount to Order</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                  {!hasSearched
                    ? "No prediction data yet. Click the button above."
                    : "Prediction returned no rows. Check DB loaders and ML API health."}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${row.ingredientName}-${index}`} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{row.ingredientName}</td>
                  <td className="px-4 py-3">{Number(row.currentStockQuantity).toFixed(2)}</td>
                  <td className="px-4 py-3">{Number(row.predictedRequiredAmount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-amber-700">{Number(row.amountToOrder).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
