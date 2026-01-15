import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6967d715000eba0774ab");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

export const DB_ID = "6967d7b300196a600140";
export const WORKOUTS_ID = "workouts";
export const MEALS_ID = "meals";
export const GOALS_ID = "goals";
export const PLANS_ID = "workout_plans";