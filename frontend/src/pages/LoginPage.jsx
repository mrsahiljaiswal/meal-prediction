import { useState } from "react";

const cafeInterior =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1800&q=85";

const LoginPage = ({ onLogin }) => {
  const [centerId, setCenterId] = useState("");
  const [empId, setEmpId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (centerId && empId) {
      onLogin(centerId, empId);
    } else {
      alert("Please enter both Center ID and Employee ID");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="absolute inset-0">
        <img
          src={cafeInterior}
          alt="Boutique cafe interior"
          className="h-full w-full scale-105 object-cover brightness-[0.62]"
        />
        <div className="absolute inset-0 bg-secondary/20 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-[2rem] border border-white/45 bg-background/85 p-8 shadow-lift backdrop-blur-2xl md:p-12">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-outline-variant/50 bg-white shadow-soft">
              <span className="font-serif text-5xl font-bold italic text-primary">
                C
              </span>
            </div>
            <h1 className="font-serif text-4xl text-on-surface">
              Welcome back, Manager
            </h1>
            <p className="mt-2 text-base text-on-surface-variant">
              Access your CafeOps terminal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block px-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Center ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  storefront
                </span>
                <input
                  type="text"
                  placeholder="Enter your location ID"
                  className="h-14 w-full rounded-2xl border border-outline-variant bg-surface-container-low/70 pl-12 pr-4 text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block px-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Employee ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  badge
                </span>
                <input
                  type="password"
                  placeholder="Enter your employee ID"
                  className="h-14 w-full rounded-2xl border border-outline-variant bg-surface-container-low/70 pl-12 pr-4 text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="soft-button flex h-[60px] w-full items-center justify-center gap-2 py-4"
            >
              Sign In
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant/40 pt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Boutique Artisanal Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
