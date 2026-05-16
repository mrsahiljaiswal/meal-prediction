import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchModelMetrics, fetchModelVsActual } from "../api";

const money = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const formatNumber = (value) =>
  Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function AnalyticsPage({ auth }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({
    modelProfit: 0,
    baselineProfit: 0,
    predictedOrders: 0,
    accuracy: 0,
    rSquared: 0,
  });

  const loadModelProfitData = async () => {
    setLoading(true);
    setError("");
    try {
      const [mlRes, metricsRes] = await Promise.all([
        fetchModelVsActual(60, auth?.centerId),
        fetchModelMetrics(),
      ]);

      const points = (mlRes.data.points || []).map((point) => ({
        mealId: point.mealId ?? point.meal_id,
        week: point.week,
        actualOrders: Number(point.actualOrders ?? point.actual_orders ?? 0),
        predictedOrders: Number(
          point.predictedOrders ?? point.predicted_orders ?? 0,
        ),
        checkoutPrice: Number(point.checkoutPrice ?? point.checkout_price ?? 0),
        basePrice: Number(point.basePrice ?? point.base_price ?? 0),
        modelProfit: Number(point.modelProfit ?? point.model_profit ?? 0),
        baselineOrders: Number(
          point.baselineOrders ?? point.baseline_orders ?? 0,
        ),
        baselineProfit: Number(
          point.baselineProfit ?? point.baseline_profit ?? 0,
        ),
      }));

      let modelProfitTotal = 0;
      let baselineProfitTotal = 0;
      let predictedOrdersTotal = 0;
      let accuracyTotal = 0;

      const weeklyData = new Map();

      points.forEach((point) => {
        const modelProfit =
          point.modelProfit || point.predictedOrders * point.checkoutPrice;
        const baselineProfit =
          point.baselineProfit || point.baselineOrders * point.checkoutPrice;
        const accuracy =
          point.actualOrders > 0
            ? Math.max(
                0,
                100 -
                  (Math.abs(point.actualOrders - point.predictedOrders) /
                    point.actualOrders) *
                    100,
              )
            : 0;

        modelProfitTotal += modelProfit;
        baselineProfitTotal += baselineProfit;
        predictedOrdersTotal += point.predictedOrders;
        accuracyTotal += accuracy;

        const weekEntry = weeklyData.get(point.week) || {
          label: `Week ${point.week}`,
          shortLabel: `W${point.week}`,
          week: point.week,
          modelProfit: 0,
          baselineProfit: 0,
          predictedOrders: 0,
          accuracyTotal: 0,
          count: 0,
        };
        weekEntry.modelProfit += modelProfit;
        weekEntry.baselineProfit += baselineProfit;
        weekEntry.predictedOrders += point.predictedOrders;
        weekEntry.accuracyTotal += accuracy;
        weekEntry.count += 1;
        weeklyData.set(point.week, weekEntry);
      });

      const chartData = Array.from(weeklyData.values())
        .sort((a, b) => a.week - b.week)
        .map((weekEntry) => ({
          label: weekEntry.label,
          shortLabel: weekEntry.shortLabel,
          modelProfit: Number(weekEntry.modelProfit.toFixed(2)),
          baselineProfit: Number(weekEntry.baselineProfit.toFixed(2)),
          predictedOrders: Number(weekEntry.predictedOrders.toFixed(2)),
          accuracy: Number(
            (weekEntry.count
              ? weekEntry.accuracyTotal / weekEntry.count
              : 0
            ).toFixed(1),
          ),
        }));

      setTotals({
        modelProfit: modelProfitTotal,
        baselineProfit: baselineProfitTotal,
        predictedOrders: predictedOrdersTotal,
        accuracy: points.length ? accuracyTotal / points.length : 0,
        rSquared:
          metricsRes.data?.metrics?.r2_score ?? mlRes.data.rSquared ?? 0,
      });
      setData(chartData);
    } catch (err) {
      console.error(err);
      setData([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Analytics data could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelProfitData();
  }, [auth?.centerId]);

  const kpis = [
    {
      label: "Model Profit",
      value: money(totals.modelProfit),
      icon: "payments",
      tone: "primary",
      meta: "Predicted",
    },
    {
      label: "Baseline",
      value: money(totals.baselineProfit),
      icon: "shopping_bag",
      tone: "secondary",
      meta: "Historical",
    },
    {
      label: "Model R2 Score",
      value: `${(totals.rSquared * 100).toFixed(1)}%`,
      icon: "trending_up",
      tone: "tertiary",
      meta: "Goodness of Fit",
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-5 py-10 md:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-5xl text-on-surface">
            Impact Analysis
          </h1>
          <p className="mt-2 text-base italic text-on-surface-variant">
            Model profit projection for center {auth?.centerId}.
          </p>
        </div>
        <button onClick={loadModelProfitData} className="muted-button w-fit">
          Recalculate
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="soft-card relative overflow-hidden p-8"
          >
            <div
              className={`absolute -right-16 -top-16 h-32 w-32 rounded-full ${
                kpi.tone === "secondary"
                  ? "bg-secondary/10"
                  : kpi.tone === "tertiary"
                    ? "bg-tertiary/10"
                    : "bg-primary/10"
              }`}
            />
            <div className="relative mb-6 flex items-start justify-between">
              <span
                className={`material-symbols-outlined rounded-2xl p-3 ${
                  kpi.tone === "secondary"
                    ? "bg-secondary-container text-secondary"
                    : kpi.tone === "tertiary"
                      ? "bg-tertiary-fixed text-tertiary"
                      : "bg-primary-fixed text-primary"
                }`}
              >
                {kpi.icon}
              </span>
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">
                {kpi.meta}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {kpi.label}
            </p>
            <h2 className="mt-2 font-serif text-5xl text-primary">
              {kpi.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid items-stretch gap-8 lg:grid-cols-12">
        <div className="soft-card p-8 lg:col-span-8">
          <div className="mb-8">
            <h3 className="font-serif text-3xl">Model Profit Trajectory</h3>
            <p className="text-sm italic text-on-surface-variant">
              Model projection compared with baselineOrders * checkoutPrice.
            </p>
          </div>

          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center text-on-surface-variant">
                Loading model profit...
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-error">
                <span className="font-semibold">Analytics unavailable</span>
                <span className="mt-2 max-w-md text-sm">{error}</span>
              </div>
            ) : data.length === 0 ? (
              <div className="flex h-full items-center justify-center text-on-surface-variant">
                No model profit data found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="modelFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#4a654e"
                        stopOpacity={0.24}
                      />
                      <stop offset="95%" stopColor="#4a654e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="baselineFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#7b535c"
                        stopOpacity={0.16}
                      />
                      <stop offset="95%" stopColor="#7b535c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e4e2de" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fill: "#737972", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#737972", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #c2c8c0",
                      boxShadow: "0 10px 30px -10px rgba(74,101,78,.2)",
                    }}
                    formatter={(value, name) => [money(value), name]}
                  />
                  <Area
                    type="monotone"
                    name="Model Profit"
                    dataKey="modelProfit"
                    stroke="#4a654e"
                    strokeWidth={3}
                    fill="url(#modelFill)"
                  />
                  <Area
                    type="monotone"
                    name="Baseline"
                    dataKey="baselineProfit"
                    stroke="#7b535c"
                    strokeWidth={3}
                    fill="url(#baselineFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <div className="soft-card p-8">
            <h3 className="font-serif text-3xl">Predicted Orders</h3>
            <p className="mb-8 mt-2 text-sm italic text-on-surface-variant">
              Order volume driving the model profit projection.
            </p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(0, 8)}>
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fill: "#737972", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [formatNumber(value), "Orders"]}
                  />
                  <Bar
                    dataKey="predictedOrders"
                    fill="#8ba88e"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-primary p-8 text-on-primary shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                Average Accuracy
              </span>
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-6xl">
                {totals.accuracy.toFixed(1)}%
              </span>
              <span className="italic opacity-90">sampled rows</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed opacity-85">
              Baseline uses historical average orders multiplied by checkout
              price from backend train.csv rows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
