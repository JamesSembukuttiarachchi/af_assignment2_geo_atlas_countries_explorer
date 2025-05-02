import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Collection references
const FAVORITES_COLLECTION = "favorites";

// Get all favorites for the current user
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(favoritesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Add a country to favorites
export const addFavorite = async (userId, countryCode) => {
  try {
    // Check if already exists
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("countryCode", "==", countryCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { message: "Country already in favorites" };
    }

    // Add new favorite
    const docRef = await addDoc(favoritesRef, {
      userId,
      countryCode,
      createdAt: new Date(),
    });

    return {
      id: docRef.id,
      countryCode,
      userId,
      message: "Country added to favorites",
    };
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

// Remove a country from favorites
export const removeFavorite = async (userId, countryCode) => {
  try {
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("countryCode", "==", countryCode)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { message: "Favorite not found" };
    }

    // Delete the document
    await deleteDoc(doc(db, FAVORITES_COLLECTION, querySnapshot.docs[0].id));

    return { message: "Favorite removed successfully" };
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};
