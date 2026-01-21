import { useEffect, useState } from "react";
import { databases, DB_ID, WORKOUTS_ID, account } from "../appwrite/config";
import { Query } from "appwrite";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);

  const getDateKey = (date) =>
    new Date(date).toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();

        const res = await databases.listDocuments(DB_ID, WORKOUTS_ID, [
          Query.equal("userId", user.$id),
          Query.orderDesc("date"),
        ]);

        const todayKey = getDateKey(new Date());

        // ✅ Only show today's workouts (do NOT delete others)
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
      <div className="p-4 sm:p-6 max-w-4xl mx-auto text-white">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-blue-400">
            Today’s Workouts
          </h2>

          <Link
            to="/add-workout"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-lg transition text-center"
          >
            + Add Workout
          </Link>
        </div>

        {workouts.length === 0 && (
          <p className="text-gray-400 text-center mt-10 text-sm">
            No workouts added today. Start your workout 💪
          </p>
        )}

        {/* WORKOUT CARDS */}
        <div className="space-y-4">
          {workouts.map((w) => (
            <div
              key={w.$id}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-5 shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                {/* LEFT INFO */}
                <div>
                  <p className="text-base sm:text-lg font-semibold text-white">
                    {w.exercise}
                  </p>

                  <p className="text-gray-300 text-sm sm:text-base mt-1">
                    {w.sets} sets × {w.reps} reps • {w.weight} kg
                  </p>

                  <p className="text-xs sm:text-sm text-blue-400 mt-1">
                    {new Date(w.date).toLocaleTimeString()}
                  </p>
                </div>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(w.$id)}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-1.5 rounded-md text-sm transition w-full sm:w-auto"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
