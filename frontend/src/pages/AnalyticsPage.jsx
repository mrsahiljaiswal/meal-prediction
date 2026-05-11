import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { fetchModelVsActual, fetchMeals } from "../api";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({
    model: 0,
    naive: 0,
    extra: 0,
    orders: 0,
  });

  const loadProfitData = async () => {
    setLoading(true);
    try {
      const [mealsRes, mlRes] = await Promise.all([
        fetchMeals(),
        fetchModelVsActual(30),
      ]);
      const meals = mealsRes.data;
      const points = mlRes.data.points || [];

      let sumModel = 0,
        sumNaive = 0,
        totalOrders = 0;

      const chartData = points.map((p) => {
        const meal = meals.find((m) => m.id === p.mealId);
        const checkoutPrice = meal ? meal.checkoutPrice : 250;
        const basePrice = meal ? meal.basePrice : 150;

        const modelSold = Math.min(p.actualOrders, p.predictedOrders);
        const modelRevenue = modelSold * checkoutPrice;
        const modelProfit = Math.max(
          0,
          modelRevenue - p.predictedOrders * basePrice,
        );

        const naiveProfit = Math.max(
          0,
          p.actualOrders * checkoutPrice - p.actualOrders * 1.3 * basePrice,
        );

        sumModel += modelProfit;
        sumNaive += naiveProfit;
        totalOrders += p.actualOrders;

        return {
          label: `Week ${p.week}`,
          modelProfit: Number(modelProfit.toFixed(2)),
          naiveProfit: Number(naiveProfit.toFixed(2)),
        };
      });

      setTotals({
        model: sumModel,
        naive: sumNaive,
        extra: sumModel - sumNaive,
        orders: totalOrders,
      });
      setData(chartData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfitData();
  }, []);

  // Custom KPI Card Component
  const KpiCard = ({
    title,
    value,
    icon,
    colorClass,
    bgClass,
    trend,
    trendUp,
  }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass} ${colorClass}`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${trendUp ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"}`}
        >
          {trend}
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {trendUp ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            )}
          </svg>
        </div>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="px-8 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            AI Financial Impact
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Detailed performance tracking and ML simulation.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-white border border-slate-100 p-1 rounded-full shadow-sm">
            <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 rounded-full">
              Daily
            </button>
            <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 rounded-full">
              Weekly
            </button>
            <button className="px-4 py-1.5 text-xs font-semibold text-[#F0592A] bg-orange-50 rounded-full">
              Monthly
            </button>
          </div>
          <button
            onClick={loadProfitData}
            className="px-4 py-1.5 bg-white border border-slate-100 text-slate-700 text-xs font-bold rounded-full shadow-sm flex items-center gap-2 hover:bg-slate-50"
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
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Recalculate
          </button>
        </div>
      </div>

      {/* KPI Row matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="AI Model Profit"
          value={`$${totals.model.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          trend="+12.5%"
          trendUp={true}
          colorClass="text-rose-500"
          bgClass="bg-rose-50"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <KpiCard
          title="Naive Baseline"
          value={`$${totals.naive.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          trend="+8.2%"
          trendUp={true}
          colorClass="text-emerald-500"
          bgClass="bg-emerald-50"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
        />
        <KpiCard
          title="Extra Value Created"
          value={`$${totals.extra.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          trend="+4.1%"
          trendUp={true}
          colorClass="text-[#F0592A]"
          bgClass="bg-orange-50"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />
        <KpiCard
          title="Total Orders Handled"
          value={totals.orders.toLocaleString()}
          trend="-2.4%"
          trendUp={false}
          colorClass="text-rose-400"
          bgClass="bg-rose-50"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Chart Area */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Profit Trajectory
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Performance over selected period
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F0592A]"></span> AI
              Model
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>{" "}
              Baseline
            </span>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-400 font-medium">
              Loading simulation...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorModel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F0592A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F0592A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNaive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                  dy={15}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontWeight: "bold" }}
                  formatter={(value) => [`$${value}`, undefined]}
                />
                <Area
                  type="monotone"
                  name="AI Profit"
                  dataKey="modelProfit"
                  stroke="#F0592A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorModel)"
                />
                <Area
                  type="monotone"
                  name="Baseline Profit"
                  dataKey="naiveProfit"
                  stroke="#cbd5e1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNaive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
