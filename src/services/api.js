import { COUNTRIES_API_URL } from "../config";
import {
  getFavorites as getFirebaseFavorites,
  addFavorite as addFirebaseFavorite,
  removeFavorite as removeFirebaseFavorite,
} from "./firebase-service";

// Countries API
export const fetchAllCountries = async () => {
  try {
    const response = await fetch(`${COUNTRIES_API_URL}/all`);
    if (!response.ok) throw new Error("Failed to fetch countries");
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const searchCountriesByName = async (name) => {
  try {
    const response = await fetch(`${COUNTRIES_API_URL}/name/${name}`);
    if (response.status === 404) return [];
    if (!response.ok) throw new Error("Failed to search countries");
    return await response.json();
  } catch (error) {
    console.error("Error searching countries:", error);
    throw error;
  }
};

export const fetchCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${COUNTRIES_API_URL}/region/${region}`);
    if (!response.ok) throw new Error("Failed to fetch countries by region");
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries by region:", error);
    throw error;
  }
};

export const fetchCountryByCode = async (code) => {
  try {
    const response = await fetch(`${COUNTRIES_API_URL}/alpha/${code}`);
    if (!response.ok) throw new Error("Failed to fetch country details");
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching country details:", error);
    throw error;
  }
};

// Favorites API using Firebase
export const getFavorites = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  return await getFirebaseFavorites(userId);
};

export const addFavorite = async (userId, countryCode) => {
  if (!userId) throw new Error("User ID is required");
  return await addFirebaseFavorite(userId, countryCode);
};

export const removeFavorite = async (userId, countryCode) => {
  if (!userId) throw new Error("User ID is required");
  return await removeFirebaseFavorite(userId, countryCode);
};
