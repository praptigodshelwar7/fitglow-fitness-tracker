import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { account } from "../appwrite/config";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-cyan-400 border-b-2 border-cyan-400"
      : "text-gray-300 hover:text-cyan-300";

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-950 via-gray-900 to-slate-950
    backdrop-blur-xl border-b border-white/10 shadow-[0_5px_30px_rgba(0,0,0,0.8)]">

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* LOGO */}
        <h1 className="text-2xl font-extrabold tracking-wide text-center sm:text-left
        text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500
        animate-pulse">
          FitGlow
        </h1>

        {/* NAV LINKS */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-5 items-center text-sm sm:text-base">

          <Link className={`transition-all pb-1 ${isActive("/dashboard")}`} to="/dashboard">
            Dashboard
          </Link>

          <Link className={`transition-all pb-1 ${isActive("/workouts")}`} to="/workouts">
            Workout
          </Link>

          <Link className={`transition-all pb-1 ${isActive("/diet")}`} to="/diet">
            Diet
          </Link>

          <Link className={`transition-all pb-1 ${isActive("/planner")}`} to="/planner">
            Planner
          </Link>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="ml-2 bg-gradient-to-r from-red-600 to-orange-500
            hover:from-red-700 hover:to-orange-600 px-4 py-1.5 rounded-xl
            text-white shadow-lg hover:shadow-red-500/40 transition-all
            active:scale-95"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
