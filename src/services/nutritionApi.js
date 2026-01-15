export const getNutrition = async (query) => {
    const res = await fetch(
    `https://api.api-ninjas.com/v1/nutrition?query=${query}`,
    {
        headers: {
        "X-Api-Key": import.meta.env.VITE_NUTRITION_KEY,
        },
    }
);

    return res.json();
};
