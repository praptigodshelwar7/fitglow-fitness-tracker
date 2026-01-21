import React from "react";
import { useEffect, useState } from "react";
import { getExercisesByMuscle } from "../services/exerciseApi";
import { databases, DB_ID, WORKOUTS_ID, ID, account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";


export default function AddWorkout() {
    const navigate = useNavigate();

    const [muscle, setMuscle] = useState("chest");
    const [exercises, setExercises] = useState([]);
    const location = useLocation();
    const plannedExercise = location.state?.exercise;
    const [form, setForm] = useState({
    exercise: plannedExercise || "",
    sets: "",
    reps: "",
    weight: "",
});

    useEffect(() => {
    getExercisesByMuscle(muscle).then(setExercises);
}, [muscle]);

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

    const handleSave = async (e) => {
    e.preventDefault();
    const user = await account.get();

    await databases.createDocument(DB_ID, WORKOUTS_ID, ID.unique(), {
        userId: user.$id,
        exercise: form.exercise,
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: Number(form.weight),
        muscle,
        date: new Date().toDateString(),
    });

    navigate("/workouts");
    

};

    return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-5 sm:p-6">

        <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-6 text-center">
          Add Workout 💪
        </h2>

        <form onSubmit={handleSave} className="space-y-4">

          {/* MUSCLE GROUP */}
          <select
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
          </select>

          {/* EXERCISE */}
          <select
            name="exercise"
            value={form.exercise}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Exercise</option>
            {Array.isArray(exercises) && exercises.slice(0, 20).map((e) => (
              <option key={e.id} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>

          {/* SETS */}
          <input
            name="sets"
            type="number"
            placeholder="Sets"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* REPS */}
          <input
            name="reps"
            type="number"
            placeholder="Reps"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* WEIGHT */}
          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* SAVE BUTTON */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2.5 rounded-lg text-white font-semibold tracking-wide"
          >
            Save Workout
          </button>

        </form>

      </div>
    </div>
  </>
);

}