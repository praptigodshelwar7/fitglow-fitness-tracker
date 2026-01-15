import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { account, databases, DB_ID, PLANS_ID } from "../appwrite/config";
import { Query, ID } from "appwrite";

export default function Planner() {
    const [planId, setPlanId] = useState(null);

    const [plan, setPlan] = useState({
    mon: "",
    tue: "",
    wed: "",
    thurs: "",
    fri: "",
    sat: "",
    sun: "",
    });

    const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
    };

    // FETCH EXISTING PLAN
    useEffect(() => {
    const fetchPlan = async () => {
        try {
        const user = await account.get();

        const res = await databases.listDocuments(DB_ID, PLANS_ID, [
            Query.equal("userId", user.$id),
        ]);

        if (res.documents.length > 0) {
            const p = res.documents[0];
            setPlanId(p.$id);
            setPlan({
                mon: p.mon || "",
                tue: p.tue || "",
                wed: p.wed || "",
                thurs: p.thurs || "",
                fri: p.fri || "",
                sat: p.sat || "",
                sun: p.sun || "",
        });
        }
        } catch (err) {
        console.log("Fetch plan error:", err);
    }
    };

    fetchPlan();
    }, []);

    // SAVE PLAN
    const handleSave = async () => {
    try {
        const user = await account.get();

        if (planId) {
        await databases.updateDocument(DB_ID, PLANS_ID, planId, plan);
    } else {
        await databases.createDocument(DB_ID, PLANS_ID, ID.unique(), {
            ...plan,
            userId: user.$id,
            createdAt: new Date().toISOString(),
        });
    }

        alert("Workout plan saved 🔥");
    } catch (err) {
        console.log("Save plan error:", err);
    }
    };

    return (
    <>
        <Navbar />

        <div className="p-6 max-w-3xl mx-auto text-white">

        <h2 className="text-2xl font-extrabold text-blue-400 mb-6">
            Weekly Workout Planner 🗓️
        </h2>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-lg">

            {[
            ["mon", "Monday"],
            ["tue", "Tuesday"],
            ["wed", "Wednesday"],
            ["thurs", "Thursday"],
            ["fri", "Friday"],
            ["sat", "Saturday"],
            ["sun", "Sunday"],
            ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-4">
                <span className="w-24 text-gray-300">{label}</span>

                <input
                name={key}
                value={plan[key]}
                onChange={handleChange}
                placeholder="Chest / Back / Legs..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                            text-white focus:outline-none focus:border-blue-500"
                />
            </div>
        ))}

        <button
            onClick={handleSave}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg
                    font-semibold transition shadow-lg" >
            Save Plan 
        </button>

        </div>

    </div>
    </>
);
}
