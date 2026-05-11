import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import PosPage from "./pages/PosPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoginPage from "./pages/LoginPage";
import PredictPage from "./pages/PredictPage";

function App() {
  const [auth, setAuth] = useState({ centerId: null, empId: null });
  const location = useLocation();

  const handleLogin = (centerId, empId) => {
    setAuth({ centerId, empId });
  };

  const handleLogout = () => {
    setAuth({ centerId: null, empId: null });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Sleek Top Navigation Bar - Only visible when logged in */}
      {auth.centerId && (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
                C
              </div>
              <span className="text-xl font-bold text-slate-800">CafeOps</span>
            </div>

            <div className="flex space-x-1 border border-slate-200 p-1 rounded-xl bg-slate-50">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${location.pathname === "/" ? "bg-white shadow-sm text-amber-600" : "text-slate-500 hover:text-slate-800"}`}
              >
                Terminal
              </Link>
              <Link
                to="/predict"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${location.pathname === "/predict" ? "bg-white shadow-sm text-amber-600" : "text-slate-500 hover:text-slate-800"}`}
              >
                Forecast
              </Link>
              <Link
                to="/analytics"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${location.pathname === "/analytics" ? "bg-white shadow-sm text-amber-600" : "text-slate-500 hover:text-slate-800"}`}
              >
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                Center: {auth.centerId}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Emp: {auth.empId}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 rounded-full hover:bg-rose-50 transition-colors"
              title="End Shift"
            >
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
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <Routes>
          <Route
            path="/login"
            element={
              !auth.centerId ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              auth.centerId ? <PosPage auth={auth} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/analytics"
            element={
              auth.centerId ? (
                <AnalyticsPage auth={auth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/predict"
            element={
              auth.centerId ? (
                <PredictPage auth={auth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
