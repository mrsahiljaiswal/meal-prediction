import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchModelVsActual } from "../api";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchModelVsActual(40);
      const payload = response.data;
      setSummary(payload);
      setData(
        (payload.points || []).map((p) => ({
          label: `M${p.mealId}`,
          actual: Number(p.actualOrders || 0),
          predicted: Number(p.predictedOrders || 0),
        }))
      );
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      setError(
        typeof backendMsg === "string"
          ? backendMsg
          : "Failed to load model comparison data."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Model Performance Dashboard</h2>
          <p className="text-sm text-slate-500">
            Compare actual historical orders vs model predictions.
          </p>
        </div>
        <button
          onClick={handleLoad}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300"
        >
          {loading ? "Loading..." : "Load Comparison"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {summary && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-3 text-sm">
            <p className="text-slate-500">Sample Size</p>
            <p className="text-lg font-semibold">{summary.sampleSize}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-3 text-sm">
            <p className="text-slate-500">MAE</p>
            <p className="text-lg font-semibold">
              {Number(summary.meanAbsoluteError || 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-3 text-sm">
            <p className="text-slate-500">MAPE (%)</p>
            <p className="text-lg font-semibold">
              {Number(summary.meanAbsolutePercentageError || 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="h-[420px] w-full rounded-lg border border-slate-200 p-2">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No data yet. Click Load Comparison.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" name="Actual Orders" fill="#4f46e5" />
              <Bar dataKey="predicted" name="Predicted Orders" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

