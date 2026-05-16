import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import PosPage from "./pages/PosPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoginPage from "./pages/LoginPage";
import PredictPage from "./pages/PredictPage";

const navItems = [
  { to: "/", label: "Terminal" },
  { to: "/predict", label: "Forecast" },
  { to: "/analytics", label: "Analytics" },
];

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
    <div className="min-h-screen bg-background text-on-surface">
      {auth.centerId && (
        <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 md:px-12">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-white text-primary shadow-soft">
                  <span className="font-serif text-2xl font-bold italic">C</span>
                </div>
                <span className="font-serif text-2xl font-bold text-primary">
                  CafeOps
                </span>
              </Link>

              <nav className="hidden items-center gap-8 md:flex">
                {navItems.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`border-b-2 pb-1 text-sm font-semibold transition ${
                        active
                          ? "border-primary text-primary"
                          : "border-transparent text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container md:inline-flex">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="hidden rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container md:inline-flex">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="hidden h-8 w-px bg-outline-variant md:block" />
              <div className="text-right">
                <p className="text-sm font-semibold">Center {auth.centerId}</p>
                <p className="text-xs italic text-secondary">Emp {auth.empId}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-secondary transition hover:scale-105"
                title="End Shift"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className={auth.centerId ? "min-h-[calc(100vh-80px)]" : "min-h-screen"}>
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
