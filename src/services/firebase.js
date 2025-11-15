import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYjmJdIJupBq-7dzcf363tTZpOvAAOJDM",
  authDomain: "miniproject-4bc9c.firebaseapp.com",
  projectId: "miniproject-4bc9c",
  storageBucket: "miniproject-4bc9c.firebasestorage.app",
  messagingSenderId: "1077002044139",
  appId: "1:1077002044139:web:5429b134e9852651bff4ae",
  measurementId: "G-JYH2TY7S6Z",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

// Save user email to Firestore
export async function saveUserEmail(email, displayName = null) {
  if (!email) return;
  
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userRef = doc(db, "users", normalizedEmail);
    
    await setDoc(userRef, {
      email: normalizedEmail,
      displayName: displayName || email.split("@")[0],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user email:", error);
  }
}

// Get all users from Firestore
export async function getAllUsers() {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

