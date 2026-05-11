import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import PosPage from "./pages/PosPage";
import PredictPage from "./pages/PredictPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function SidebarLink({ to, icon, label, exact = false }) {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "bg-[#F0592A] text-white shadow-md shadow-orange-200/50"
          : "text-slate-500 hover:bg-orange-50 hover:text-[#F0592A]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function App() {
  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-slate-800 overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full z-20">
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F0592A]">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">
              The Kitchen
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
              Terminal 01
            </p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="px-4 space-y-1 mt-2">
          <SidebarLink
            to="/pos"
            label="Dashboard"
            exact
            icon={
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            }
          />
          <SidebarLink
            to="/analytics"
            label="Analytics"
            icon={
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
          <SidebarLink
            to="/predict"
            label="Inventory (AI)"
            icon={
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
          />
        </nav>

        {/* Categories (Mock UI to match reference) */}
        <div className="mt-8 px-4 flex-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Categories
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[#F0592A] cursor-pointer">
              <span className="text-lg">🍴</span> Appetizers
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
              <span className="text-lg">🥩</span> Mains
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
              <span className="text-lg">🍷</span> Drinks
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
              <span className="text-lg">🍨</span> Desserts
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button className="w-full flex justify-center items-center gap-2 text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 py-3 rounded-xl transition-colors">
            <svg
              className="w-4 h-4 text-[#F0592A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Order
          </button>
          <button className="w-full flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 px-4 py-3">
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0 bg-[#f8f9fa] z-10">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-[#F0592A]">
              Luminescent POS
            </h2>
            <div className="relative">
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search menu..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64 shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
              ✨ Remix
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
              💻 Device
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Routes>
            <Route path="/pos" element={<PosPage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/pos" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
