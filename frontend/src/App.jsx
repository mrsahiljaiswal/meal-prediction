import { Link, Navigate, Route, Routes } from "react-router-dom";
import PosPage from "./pages/PosPage";
import PredictPage from "./pages/PredictPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-indigo-700">Luminescent POS</h1>
          <nav className="flex gap-3">
            <Link
              to="/pos"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              POS Terminal
            </Link>
            <Link
              to="/predict"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Forecast Dashboard
            </Link>
            <Link
              to="/analytics"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <Routes>
          <Route path="/pos" element={<PosPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/pos" replace />} />
        </Routes>
      </main>
    </div>
  );
}
