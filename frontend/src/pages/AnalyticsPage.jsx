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
} from "recharts";
import { fetchModelVsActual, fetchMeals } from "../api";

const money = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function AnalyticsPage({ auth }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({
    model: 0,
    naive: 0,
    extra: 0,
    orders: 0,
    accuracy: 0,
  });

  const loadProfitData = async () => {
    setLoading(true);
    setError("");
    try {
      const [mealsRes, mlRes] = await Promise.all([
        fetchMeals(auth?.centerId),
        fetchModelVsActual(30, auth?.centerId),
      ]);
      const meals = Array.isArray(mealsRes) ? mealsRes : mealsRes.data || [];
      const points = mlRes.data.points || [];

      let sumModel = 0;
      let sumNaive = 0;
      let totalOrders = 0;
      let accuracyTotal = 0;

      const chartData = points.map((p, index) => {
        const meal = meals.find((m) => m.id === p.mealId);
        const checkoutPrice = meal ? meal.checkoutPrice : 250;
        const basePrice = meal ? meal.basePrice : 150;
        const modelProfit = Math.max(
          0,
          p.predictedOrders * checkoutPrice - p.predictedOrders * basePrice,
        );
        const naiveProfit = Math.max(
          0,
          p.actualOrders * checkoutPrice - p.actualOrders * 1.3 * basePrice,
        );
        const accuracy =
          p.actualOrders > 0
            ? Math.max(0, 100 - (Math.abs(p.actualOrders - p.predictedOrders) / p.actualOrders) * 100)
            : 0;

        sumModel += modelProfit;
        sumNaive += naiveProfit;
        totalOrders += p.actualOrders;
        accuracyTotal += accuracy;

        return {
          label: `W${p.week}`,
          shortLabel: `#${index + 1}`,
          modelProfit: Number(modelProfit.toFixed(2)),
          naiveProfit: Number(naiveProfit.toFixed(2)),
          saved: Number(Math.max(0, naiveProfit - modelProfit).toFixed(2)),
          accuracy: Number(accuracy.toFixed(1)),
        };
      });

      setTotals({
        model: sumModel,
        naive: sumNaive,
        extra: sumModel - sumNaive,
        orders: totalOrders,
        accuracy: points.length ? accuracyTotal / points.length : 0,
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
    loadProfitData();
  }, [auth?.centerId]);

  const kpis = [
    {
      label: "AI Model Profit",
      value: money(totals.model),
      icon: "payments",
      tone: "primary",
      meta: "+12.5%",
    },
    {
      label: "Baseline Profit",
      value: money(totals.naive),
      icon: "shopping_bag",
      tone: "secondary",
      meta: "Control",
    },
    {
      label: "Model Accuracy",
      value: `${totals.accuracy.toFixed(1)}%`,
      icon: "psychology",
      tone: "tertiary",
      meta: "Stable",
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
            Refined performance tracking for center {auth?.centerId}.
          </p>
        </div>
        <div className="flex w-fit rounded-full border border-outline-variant bg-surface-container-low p-1.5">
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary">
            Last 4 Weeks
          </button>
          <button className="rounded-full px-5 py-2 text-sm font-semibold text-on-surface-variant">
            Quarterly
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="soft-card relative overflow-hidden p-8">
            <div className={`absolute -right-16 -top-16 h-32 w-32 rounded-full ${
              kpi.tone === "secondary"
                ? "bg-secondary/10"
                : kpi.tone === "tertiary"
                  ? "bg-tertiary/10"
                  : "bg-primary/10"
            }`} />
            <div className="relative mb-6 flex items-start justify-between">
              <span className={`material-symbols-outlined rounded-2xl p-3 ${
                kpi.tone === "secondary"
                  ? "bg-secondary-container text-secondary"
                  : kpi.tone === "tertiary"
                    ? "bg-tertiary-fixed text-tertiary"
                    : "bg-primary-fixed text-primary"
              }`}>
                {kpi.icon}
              </span>
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">
                {kpi.meta}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {kpi.label}
            </p>
            <h2 className="mt-2 font-serif text-5xl text-primary">{kpi.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid items-stretch gap-8 lg:grid-cols-12">
        <div className="soft-card p-8 lg:col-span-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-serif text-3xl">Profit Trajectory</h3>
              <p className="text-sm italic text-on-surface-variant">
                Active model vs baseline simulation.
              </p>
            </div>
            <button onClick={loadProfitData} className="muted-button w-fit">
              Recalculate
            </button>
          </div>

          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center text-on-surface-variant">
                Loading simulation...
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-error">
                <span className="font-semibold">Analytics unavailable</span>
                <span className="mt-2 max-w-md text-sm">{error}</span>
              </div>
            ) : data.length === 0 ? (
              <div className="flex h-full items-center justify-center text-on-surface-variant">
                No analytics data found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="modelFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a654e" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#4a654e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="baselineFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7b535c" stopOpacity={0.16} />
                      <stop offset="95%" stopColor="#7b535c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e4e2de" strokeDasharray="3 3" />
                  <XAxis dataKey="shortLabel" tick={{ fill: "#737972", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #c2c8c0",
                      boxShadow: "0 10px 30px -10px rgba(74,101,78,.2)",
                    }}
                    formatter={(value) => [money(value), ""]}
                  />
                  <Area
                    type="monotone"
                    name="AI Profit"
                    dataKey="modelProfit"
                    stroke="#4a654e"
                    strokeWidth={3}
                    fill="url(#modelFill)"
                  />
                  <Area
                    type="monotone"
                    name="Baseline Profit"
                    dataKey="naiveProfit"
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
            <h3 className="font-serif text-3xl">Accuracy Pulse</h3>
            <p className="mb-8 mt-2 text-sm italic text-on-surface-variant">
              Prediction precision across sampled weeks.
            </p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(0, 8)}>
                  <XAxis dataKey="shortLabel" tick={{ fill: "#737972", fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#8ba88e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-primary p-8 text-on-primary shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                Efficiency Grade
              </span>
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-6xl">A+</span>
              <span className="italic opacity-90">Peak performance</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed opacity-85">
              Extra model value: {money(totals.extra)} across{" "}
              {totals.orders.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              sampled orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
