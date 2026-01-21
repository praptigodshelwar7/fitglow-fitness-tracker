import { useEffect, useState } from "react";
import { databases, DB_ID, MEALS_ID, account } from "../appwrite/config";
import { Query } from "appwrite";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Diet() {
  const [meals, setMeals] = useState([]);
  const [totalProtein, setTotalProtein] = useState(0);

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

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const user = await account.get();

        const res = await databases.listDocuments(DB_ID, MEALS_ID, [
          Query.equal("userId", user.$id),
          Query.orderDesc("date"),
        ]);

        const todayKey = getDateKey(new Date());

        const todayMeals = res.documents.filter(
          (m) => getDateKey(m.date) === todayKey
        );

        // ❗ NOT deleting old meals now (safer for history)
        setMeals(todayMeals);

        const total = todayMeals.reduce(
          (sum, m) => sum + Number(m.protein || 0),
          0
        );

        setTotalProtein(total);
      } catch (err) {
        console.log("Diet fetch error:", err);
      }
    };

    fetchMeals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DB_ID, MEALS_ID, id);
      setMeals((prev) => prev.filter((m) => m.$id !== id));
    } catch (err) {
      console.log("Delete meal error:", err);
    }
  };

  return (
    <>
      <Navbar />

      {/* FULL SCREEN DARK BG */}
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-6 py-6">

        {/* CENTER CONTENT */}
        <div className="max-w-4xl mx-auto text-white">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

            <h2 className="text-2xl sm:text-3xl font-extrabold 
            text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">
              Diet Tracker
            </h2>

            <Link
              to="/add-meal"
              className="bg-gradient-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 px-5 py-2 rounded-xl 
              shadow-lg hover:shadow-green-500/40 transition text-center font-semibold"
            >
              + Add Meal
            </Link>

          </div>

          {/* TODAY PROTEIN CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
          rounded-2xl p-5 mb-8 shadow-xl">

            <p className="text-gray-400 text-sm">Today’s Protein</p>
            <p className="text-3xl font-extrabold text-lime-400 drop-shadow-lg">
              {totalProtein} g
            </p>

          </div>

          {/* EMPTY STATE */}
          {meals.length === 0 && (
            <p className="text-gray-400 text-center mt-20 text-sm animate-pulse">
              No meals added today. Fuel your gains 🥗🔥
            </p>
          )}

          {/* MEAL CARDS */}
          <div className="space-y-5">
            {meals.map((m) => (
              <div
                key={m.$id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 
                rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition-transform"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                  {/* INFO */}
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-white">
                      {m.food}
                    </p>

                    <p className="text-gray-300 text-sm sm:text-base mt-1">
                       {m.protein} g protein • 🔥 {m.calories} cal
                    </p>

                    <p className="text-xs sm:text-sm text-green-400 mt-1">
                      {m.mealType}
                    </p>
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(m.$id)}
                    className="bg-gradient-to-r from-red-600/20 to-orange-500/20 
                    text-red-400 hover:from-red-600/40 hover:to-orange-500/40 
                    px-5 py-1.5 rounded-xl text-sm transition-all 
                    w-full sm:w-auto active:scale-95"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
