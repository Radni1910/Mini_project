import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function HeaderMenu({ color = "#111", background = "#fff" }) {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Guest User");
  const [email, setEmail] = useState("Not signed in");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || "User");
        setEmail(user.email || "No email");
      } else {
        setName("Guest User");
        setEmail("Not signed in");
      }
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
      navigation.replace("Welcome");
    } catch (e) {
      setOpen(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => setOpen((s) => !s)} style={styles.iconBtn}>
        <Ionicons name="menu" size={26} color={color} />
      </TouchableOpacity>

      {open && (
        <View style={[styles.menu, { backgroundColor: background }]}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => {
              setOpen(false);
              navigation.navigate("Profile");
            }}
          >
            <Ionicons name="person-circle-outline" size={28} color="#5d9680ff" />
            <View style={styles.profileText}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#d9534f" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 9999,
    elevation: 50,
  },
  iconBtn: {
    padding: 6,
  },
  menu: {
    position: "absolute",
    top: 36,
    right: 0,
    width: 240,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 10000,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  email: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: "#d9534f",
    fontWeight: "700",
  },
});


