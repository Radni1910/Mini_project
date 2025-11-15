import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isAdminEmail } from "../config/vip";

export default function AdminFab() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminEmail(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  // Only show admin fab if user is an admin
  if (!isAdmin) return null;

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AdminLogin")}
        activeOpacity={0.9}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Open Admin"
      >
        <Ionicons name="shield-checkmark" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 12,
    top: 32,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111",
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
});
