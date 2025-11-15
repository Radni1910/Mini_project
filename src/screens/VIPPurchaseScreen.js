import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { setVipStatus } from "../config/vip";

export default function VIPPurchaseScreen({ navigation }) {
  const [processing, setProcessing] = useState(false);

  const handlePayNow = async () => {
    if (processing) return;
    setProcessing(true);

    // Get current user email
    const user = auth.currentUser;
    const userEmail = user?.email;

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // Save VIP status to AsyncStorage
        if (userEmail) {
          await setVipStatus(userEmail, true);
        }

        setProcessing(false);
        Alert.alert("Payment Successful", "You are now a VIP!", [
          {
            text: "Continue",
            onPress: () => navigation.replace("VIPRoomDecorator"),
          },
        ]);
      } catch (error) {
        console.error("Error saving VIP status:", error);
        setProcessing(false);
        Alert.alert(
          "Error",
          "Payment successful but failed to update VIP status. Please contact support."
        );
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="diamond" size={20} color="#FFD700" />
          <Text style={styles.title}>Upgrade to VIP</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.priceRow}>
          <Text style={styles.planName}>VIP Access</Text>
          <Text style={styles.priceText}>rs499</Text>
        </View>
        <Text style={styles.subtitle}>
          Unlock premium objects, no watermark, offline library, and more.
        </Text>

        <View style={styles.benefits}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Premium furniture collection</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Save without watermark</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Offline object library</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Unlimited designs</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayNow}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#1a1a1a" />
          ) : (
            <>
              <Ionicons name="card" size={18} color="#1a1a1a" />
              <Text style={styles.payText}>Pay Now</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          disabled={processing}
        >
          <Text style={styles.secondaryText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 2,
    borderBottomColor: "#FFD700",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  card: {
    margin: 16,
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  planName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  priceText: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: "#ccc",
    marginBottom: 16,
  },
  benefits: {
    gap: 10,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    color: "#fff",
  },
  payButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
  },
  secondaryText: {
    color: "#aaa",
  },
});
