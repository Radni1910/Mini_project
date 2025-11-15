import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { isVipEmail, isAdminEmail } from "../config/vip";

export default function ProfileScreen({ navigation }) {
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("Not signed in");
  const [role, setRole] = useState("Guest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        setUserEmail(user.email || "No email");
        
        // Check role asynchronously
        if (isAdminEmail(user.email)) {
          setRole("Admin");
        } else {
          const isVip = await isVipEmail(user.email);
          if (isVip) {
            setRole("VIP");
          } else {
            setRole("Normal");
          }
        }
      } else {
        setUserName("Guest User");
        setUserEmail("Not signed in");
        setRole("Guest");
      }
    });
    return unsubscribe;
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const getRoleIcon = () => {
    if (role === "VIP") return "diamond";
    if (role === "Admin") return "shield-checkmark";
    if (role === "Normal") return "person";
    return "person-outline";
  };

  const getRoleColor = () => {
    if (role === "VIP") return "#FFD700";
    if (role === "Admin") return "#d9534f";
    if (role === "Normal") return "#5d9680ff";
    return "#9CA3AF";
  };

  const getInitials = () => {
    if (userName === "Guest User") return "GU";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section with Avatar */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: getRoleColor() + "20", borderColor: getRoleColor() }]}>
              <Text style={[styles.avatarText, { color: getRoleColor() }]}>
                {getInitials()}
              </Text>
            </View>
            {role === "VIP" && (
              <View style={styles.vipBadge}>
                <Ionicons name="diamond" size={16} color="#FFD700" />
              </View>
            )}
            {role === "Admin" && (
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#d9534f" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.roleContainer}>
            <Ionicons name={getRoleIcon()} size={18} color={getRoleColor()} />
            <Text style={[styles.roleText, { color: getRoleColor() }]}>{role}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: "#5d9680ff20" }]}>
                <Ionicons name="person" size={24} color="#5d9680ff" />
              </View>
              <Text style={styles.label}>Full Name</Text>
            </View>
            <Text style={styles.value}>{userName}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: "#3B82F620" }]}>
                <Ionicons name="mail" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.label}>Email Address</Text>
            </View>
            <Text style={styles.value}>{userEmail}</Text>
          </View>

          <View style={[styles.card, styles.roleCard, { borderColor: getRoleColor() + "40" }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: getRoleColor() + "20" }]}>
                <Ionicons name={getRoleIcon()} size={24} color={getRoleColor()} />
              </View>
              <Text style={styles.label}>Account Type</Text>
            </View>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor() + "15" }]}>
              <Ionicons name={getRoleIcon()} size={20} color={getRoleColor()} />
              <Text style={[styles.roleBadgeText, { color: getRoleColor() }]}>{role}</Text>
            </View>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  vipBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  adminBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#d9534f",
    shadowColor: "#d9534f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  roleCard: {
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginLeft: 60,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 60,
    gap: 8,
  },
  roleBadgeText: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#5d9680ff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#5d9680ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});


