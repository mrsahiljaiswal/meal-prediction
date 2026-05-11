import { useState } from "react";
import { fetchPrediction } from "../api";

export default function PredictPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetchPrediction();
      setRows(response.data);
      setHasSearched(true);
    } catch (err) {
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            AI Inventory Forecast
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Automated ingredient purchase requirements for next week.
          </p>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="rounded-full bg-[#F0592A] px-6 py-3 font-bold text-white transition hover:bg-orange-600 shadow-md shadow-orange-200"
        >
          {loading ? "Analyzing Models..." : "Run Weekly Forecast"}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                Ingredient Name
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">
                Current Stock
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">
                Predicted Need
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">
                Amount to Order
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-16 text-center text-slate-400 text-sm font-semibold"
                >
                  {!hasSearched
                    ? "Ready to predict. Click 'Run Weekly Forecast'."
                    : "No prediction data found. Ensure ML API is online."}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const needsOrder = row.amountToOrder > 0;
                return (
                  <tr
                    key={`${row.ingredientName}-${index}`}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-5 font-bold text-slate-800">
                      {row.ingredientName}
                    </td>
                    <td className="px-6 py-5 text-right text-slate-500 font-medium">
                      {Number(row.currentStockQuantity).toFixed(1)}g
                    </td>
                    <td className="px-6 py-5 text-right text-[#F0592A] font-bold">
                      {Number(row.predictedRequiredAmount).toFixed(1)}g
                    </td>
                    <td
                      className={`px-6 py-5 text-right font-black ${needsOrder ? "text-rose-500" : "text-slate-300"}`}
                    >
                      {Number(row.amountToOrder).toFixed(1)}g
                    </td>
                    <td className="px-6 py-5 text-center">
                      {needsOrder ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-rose-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>{" "}
                          Reorder
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{" "}
                          Safe
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
