import React from "react";
import { useEffect, useState } from "react";
import { databases, DB_ID, MEALS_ID, account } from "../appwrite/config";
import { Query } from "appwrite";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Diet() {
    const [meals, setMeals] = useState([]);
    const [totalProtein, setTotalProtein] = useState(0);

    useEffect(() => {
    const fetchMeals = async () => {
        try {
        const user = await account.get();

        const res = await databases.listDocuments(DB_ID, MEALS_ID, [
            Query.equal("userId", user.$id),
            Query.orderDesc("date"),
        ]);

        setMeals(res.documents);

        const today = new Date().toDateString();

        const total = res.documents
            .filter((m) => new Date(m.date).toDateString() === today)
            .reduce((sum, m) => sum + Number(m.protein || 0), 0);

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
            setMeals(prev => prev.filter(m => m.$id !== id));
        } catch (err) {
            console.log("Delete meal error:", err);
        }
        };


    return (
        <>
        <Navbar />

        <div className="p-6 max-w-4xl mx-auto text-white">

        {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-green-400">
                    Diet History 🥗
                </h2>

                <Link
                    to="/add-meal"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-lg transition">
                + Add Meal
                </Link>
            </div>

        {/* TODAY PROTEIN */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6 shadow-lg">
                <p className="text-gray-400">Today’s Protein</p>
                <p className="text-3xl font-bold text-green-400">{totalProtein} g </p>
            </div>

        {/* EMPTY STATE */}
            {meals.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
                No meals added yet. Start tracking your diet 🥗
            </p>
            )}

        {/* MEAL CARDS */}
        <div className="space-y-4">
        {meals.map((m) => (
            <div
                key={m.$id}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-start">

        {/* LEFT INFO */}
            <div>
                <p className="text-lg font-semibold text-white">
                    {m.food}
                </p>

                <p className="text-gray-300 mt-1">
                    {m.protein} g protein • {m.calories} cal
                </p>

                <p className="text-sm text-green-400 mt-1">
                    {m.mealType}
                </p>
            </div>

        {/* DELETE BUTTON */}
            <button
                onClick={() => handleDelete(m.$id)}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded-md text-sm transition">
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
