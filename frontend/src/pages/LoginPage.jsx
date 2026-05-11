import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [centerId, setCenterId] = useState("");
  const [empId, setEmpId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (centerId && empId) {
      onLogin(centerId, empId); // Execute login prop to update App state
    } else {
      alert("Please enter both Center ID and Employee ID");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-100">
      <div className="px-10 py-8 mt-4 text-left bg-white shadow-xl rounded-2xl w-full max-w-md border border-slate-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl font-bold">
            C
          </div>
        </div>
        <h3 className="text-2xl font-bold text-center text-slate-800">
          CafeOps Terminal
        </h3>
        <p className="text-sm text-center text-slate-500 mb-6">
          Enter your credentials to begin shift
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-slate-700 font-medium">
              Center ID
            </label>
            <input
              type="text"
              placeholder="e.g. 55"
              className="w-full px-4 py-3 mt-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={centerId}
              onChange={(e) => setCenterId(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-slate-700 font-medium">
              Employee ID
            </label>
            <input
              type="password"
              placeholder="Enter Emp ID"
              className="w-full px-4 py-3 mt-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
            />
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-amber-600 rounded-lg hover:bg-amber-700 font-semibold shadow-md transition-colors"
            >
              Access Terminal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
