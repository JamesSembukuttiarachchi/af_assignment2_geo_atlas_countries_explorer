import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const FAVORITES_COLLECTION = "favorites";

export const getFirebaseFavorites = async (userId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().countryCode);
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
};

export const addFirebaseFavorite = async (userId, countryCode) => {
  try {
    // Check if already exists
    const existsQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("countryCode", "==", countryCode)
    );
    const existsSnapshot = await getDocs(existsQuery);

    if (!existsSnapshot.empty) {
      return { success: false, message: "Already in favorites" };
    }

    // Add new favorite
    await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      countryCode,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFirebaseFavorite = async (userId, countryCode) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("countryCode", "==", countryCode)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "Favorite not found" };
    }

    // Delete all matching documents (though there should only be one)
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};
