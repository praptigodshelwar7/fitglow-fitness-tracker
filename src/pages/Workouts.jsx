import { useEffect, useState } from "react";
import { databases, DB_ID, WORKOUTS_ID, account } from "../appwrite/config";
import { Query } from "appwrite";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


export default function Workouts() {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
    const user = await account.get();

    const res = await databases.listDocuments(DB_ID, WORKOUTS_ID, [
        Query.equal("userId", user.$id),
        Query.orderDesc("date"),
    ]);

    const today = new Date().toDateString();

    const todayWorkouts = res.documents.filter(
        (w) => new Date(w.date).toDateString() === today
    );

    const oldWorkouts = res.documents.filter(
        (w) => new Date(w.date).toDateString() !== today
    );

    for (let w of oldWorkouts) {
        await databases.deleteDocument(DB_ID, WORKOUTS_ID, w.$id);
    }

    setWorkouts(todayWorkouts);
    };

    fetchData();
}, []);


    const handleDelete = async (id) => {
        try {
            await databases.deleteDocument(DB_ID, WORKOUTS_ID, id);
            setWorkouts(prev => prev.filter(w => w.$id !== id));
        }catch(err){
    console.log("Delete error:", err);
    }
    };

    return (
    <>
        <Navbar />
        <div className="p-6 max-w-4xl mx-auto text-white">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-blue-400">Workout History </h2>
                    <Link
                        to="/add-workout"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-lg transition">+ Add Workout
                    </Link>
            </div>

            {workouts.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
                No workouts added yet. Start your first workout 
            </p>)}

      {/* WORKOUT CARDS */}
            <div className="space-y-4">

                {workouts.map((w) => (
                    <div
                        key={w.$id}
                        className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-start">

        {/* LEFT INFO */}
            <div>
                <p className="text-lg font-semibold text-white">
                    {w.exercise}
                </p>

                <p className="text-gray-300 mt-1">
                    {w.sets} sets × {w.reps} reps • {w.weight} kg
                </p>

                <p className="text-sm text-blue-400 mt-1">
                    {new Date(w.date).toDateString()}
                </p>
            </div>

              {/* ACTION BUTTONS */}
                <div className="flex gap-2">

                

                {/* DELETE */}
                <button
                    onClick={() => handleDelete(w.$id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded-md text-sm transition">
                    Delete
                </button>


            </div>

            </div>
        </div>
        ))}

    </div>

    </div>
    </>
);
}
