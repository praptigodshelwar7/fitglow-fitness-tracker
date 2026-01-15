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
        date: new Date().toISOString(),
    });

    navigate("/workouts");
    

};

    return (
    <>
        <Navbar />
        <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-800 px-39">Add Workout</h2>

        <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-xl">

            <select
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            className="w-full mb-3 p-2 bg-gray-900 text-white rounded"
            >
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            </select>

            <select
            name="exercise"
            onChange={handleChange}
            className="w-full mb-3 p-2 bg-gray-900 text-white rounded"
            >
            <option>Select Exercise</option>
            {exercises.slice(0, 20).map((e) => (
                <option key={e.id} value={e.name}>
                {e.name}
                </option>
            ))}
            </select>

            <input name="sets" placeholder="Sets" onChange={handleChange}
            className="w-full mb-3 p-2 bg-gray-900 text-white rounded" />

            <input name="reps" placeholder="Reps" onChange={handleChange}
            className="w-full mb-3 p-2 bg-gray-900 text-white rounded" />

            <input name="weight" placeholder="Weight (kg)" onChange={handleChange}
            className="w-full mb-4 p-2 bg-gray-900 text-white rounded" />

            <button className="w-full bg-white py-2 font-bold rounded text-blue-800">
            Save Workout
            </button>
        </form>
        </div>
    </>
);
}
