import { COUNTRIES_API_URL } from "../config";
import {
  getFirebaseFavorites,
  addFirebaseFavorite,
  removeFirebaseFavorite,
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
  try {
    if (!userId) throw new Error("User ID is required");
    const favorites = await getFirebaseFavorites(userId);
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw new Error("Failed to get favorites. Please try again.");
  }
};

export const addFavorite = async (userId, countryCode) => {
  try {
    if (!userId || !countryCode) {
      throw new Error("User ID and country code are required");
    }
    return await addFirebaseFavorite(userId, countryCode);
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw new Error(error.message || "Failed to add favorite");
  }
};

export const removeFavorite = async (userId, countryCode) => {
  try {
    if (!userId || !countryCode) {
      throw new Error("User ID and country code are required");
    }
    return await removeFirebaseFavorite(userId, countryCode);
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw new Error(error.message || "Failed to remove favorite");
  }
};
