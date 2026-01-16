export const getExercisesByMuscle = async (muscle) => {
    
    const res = await fetch(
    `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${muscle}`,
    {
        headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_EXERCISE_KEY,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
    }
);

    return res.json();
};
