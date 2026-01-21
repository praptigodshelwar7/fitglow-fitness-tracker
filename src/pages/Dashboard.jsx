import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { account, databases, DB_ID, WORKOUTS_ID, MEALS_ID, PLANS_ID } from "../appwrite/config";
import { Query } from "appwrite";
import { useNavigate, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "../charts/chartConfig";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [workoutCount, setWorkoutCount] = useState(0);
  const [proteinToday, setProteinToday] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [proteinPercent, setProteinPercent] = useState(0);
  const [todayPlan, setTodayPlan] = useState("");

  const PROTEIN_GOAL = 100;

  // ✅ SAFE LOCAL DATE KEY (NO TIMEZONE BUG)
  const getDateKey = (d) => {
    const date = new Date(d);
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  // ✅ AUTH PROTECT
  useEffect(() => {
    account.get().catch(() => navigate("/"));
  }, []);

  // ✅ FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = await account.get();

        // ---------------- WORKOUTS ----------------
        const workoutRes = await databases.listDocuments(DB_ID, WORKOUTS_ID, [
          Query.equal("userId", user.$id),
          Query.orderDesc("date"),
        ]);

        const workouts = workoutRes.documents;
        setWorkoutCount(workouts.length);

        // ---- STREAK ----
        const daysSet = new Set(workouts.map((w) => getDateKey(w.date)));

        let streakCount = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = getDateKey(d);

          if (daysSet.has(key)) streakCount++;
          else break;
        }
        setStreak(streakCount);

        // ---- WEEKLY CHART ----
        const map = {};
        workouts.forEach((w) => {
          const key = getDateKey(w.date);
          map[key] = (map[key] || 0) + 1;
        });

        const labels = [];
        const values = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = getDateKey(d);

          labels.push(d.toLocaleDateString("en-IN", { weekday: "short" }));
          values.push(map[key] || 0);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "Workouts",
              data: values,
              backgroundColor: "#3b82f6",
              borderRadius: 8,
            },
          ],
        });

        // ---------------- PROTEIN ----------------
        const mealRes = await databases.listDocuments(DB_ID, MEALS_ID, [
          Query.equal("userId", user.$id),
        ]);

        const todayKey = getDateKey(new Date());

        const mealsToday = mealRes.documents.filter(
          (m) => getDateKey(m.date) === todayKey
        );

        const protein = mealsToday.reduce(
          (sum, m) => sum + Number(m.protein || 0),
          0
        );

        setProteinToday(protein);

        const percent = Math.min(
          Math.round((protein / PROTEIN_GOAL) * 100),
          100
        );
        setProteinPercent(percent);

        // ---------------- TODAY PLAN ----------------
        const planRes = await databases.listDocuments(DB_ID, PLANS_ID, [
          Query.equal("userId", user.$id),
        ]);

        if (planRes.documents.length > 0) {
          const plan = planRes.documents[0];
          const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
          const todayKey = dayMap[new Date().getDay()];
          setTodayPlan(plan[todayKey] || "Rest Day");
        }

      } catch (err) {
        console.log("Dashboard error:", err);
        navigate("/");
      }
    };

    fetchStats();
  }, [location.pathname]);

  return (
    <>
      <Navbar />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto text-white">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">

          <div className="bg-gray-900 border border-gray-700 p-4 sm:p-5 rounded-2xl shadow-lg">
            <p className="text-gray-300 text-sm">Workout Streak</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-orange-400">
              🔥 {streak} days
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-4 sm:p-5 rounded-2xl shadow-lg">
            <p className="text-gray-300 text-sm">Total Workouts</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-blue-400">
              {workoutCount}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-4 sm:p-5 rounded-2xl shadow-lg">
            <p className="text-gray-300 text-sm">Protein Today</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-green-400">
              {proteinToday} g
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-4 sm:p-5 rounded-2xl shadow-lg">
            <p className="text-gray-300 text-sm">Active Days</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-purple-400">
              {chartData ? chartData.datasets[0].data.filter(v => v > 0).length : 0} / 7
            </p>
          </div>

        </div>

        {/* PROTEIN GOAL */}
        <div className="bg-gray-900 border border-gray-700 p-5 sm:p-6 rounded-2xl shadow-lg mb-8">

          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-300 font-medium">Daily Protein Goal</p>
            <p className="text-sm text-gray-400">
              {proteinToday}g / {PROTEIN_GOAL}g
            </p>
          </div>

          <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
            <div
              className="h-4 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${proteinPercent}%` }}
            ></div>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            {proteinPercent >= 100 ? "Goal Achieved 🎉" : `${proteinPercent}% completed`}
          </p>

        </div>

        {/* TODAY PLAN */}
        <div className="bg-gray-900 border border-gray-700 p-5 sm:p-6 rounded-2xl shadow-lg mb-8">

          <p className="text-gray-400 mb-1 text-sm">Today’s Workout Plan</p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">
              {todayPlan || "Loading..."}
            </p>

            <button
              onClick={() =>
                navigate("/add-workout", { state: { exercise: todayPlan } })
              }
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition w-full sm:w-auto"
            >
              Start Workout 💪
            </button>
          </div>

        </div>

        {/* WEEKLY CHART */}
        <div className="bg-gray-900 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg">

          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-base sm:text-lg text-gray-100">
              Workouts This Week
            </h3>
            <span className="text-xs sm:text-sm text-gray-400">
              Last 7 days
            </span>
          </div>

          <div className="h-[260px] sm:h-[320px]">
            {chartData && (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { color: "#e5e7eb" } },
                    x: { ticks: { color: "#e5e7eb" } },
                  },
                }}
              />
            )}
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;
