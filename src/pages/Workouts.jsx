import { useEffect, useState } from "react";
import { databases, DB_ID, WORKOUTS_ID, account } from "../appwrite/config";
import { Query } from "appwrite";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);

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
    const fetchData = async () => {
      try {
        const user = await account.get();

        const res = await databases.listDocuments(DB_ID, WORKOUTS_ID, [
          Query.equal("userId", user.$id),
          Query.orderDesc("date"),
        ]);

        const todayKey = getDateKey(new Date());

        const todayWorkouts = res.documents.filter(
          (w) => getDateKey(w.date) === todayKey
        );

        setWorkouts(todayWorkouts);
      } catch (err) {
        console.log("Fetch workouts error:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DB_ID, WORKOUTS_ID, id);
      setWorkouts((prev) => prev.filter((w) => w.$id !== id));
    } catch (err) {
      console.log("Delete error:", err);
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
            text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Today’s Workouts
            </h2>

            <Link
              to="/add-workout"
              className="bg-gradient-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 px-5 py-2 rounded-xl 
              shadow-lg hover:shadow-green-500/40 transition text-center font-semibold"
            >
              + Add Workout
            </Link>

          </div>

          {/* EMPTY STATE */}
          {workouts.length === 0 && (
            <p className="text-gray-400 text-center mt-20 text-sm animate-pulse">
              No workouts added today. Time to crush it 💪🔥
            </p>
          )}

          {/* WORKOUT CARDS */}
          <div className="space-y-5">
            {workouts.map((w) => (
              <div
                key={w.$id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 
                rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition-transform"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                  {/* INFO */}
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-white">
                      {w.exercise}
                    </p>

                    <p className="text-gray-300 text-sm sm:text-base mt-1">
                      {w.sets} sets × {w.reps} reps • {w.weight} kg
                    </p>

                    <p className="text-xs sm:text-sm text-cyan-400 mt-1">
                      ⏱ {new Date(w.date).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(w.$id)}
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
