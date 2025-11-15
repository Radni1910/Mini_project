import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
// import AdminFab from "../components/AdminFab";
import HeaderMenu from "../components/HeaderMenu";

export default function FeaturesScreen({ navigation }) {
  const handleUpgradeToVIP = () => {
    // Navigate to VIP purchase screen
    navigation.replace("VIPPurchase");
  };

  const handleContinue = () => {
    navigation.replace("RoomDecorator");
  };

  const features = [
    {
      icon: "image-outline",
      title: "Room Decoration",
      description: "Design and decorate your room with furniture and objects",
      free: true,
    },
    {
      icon: "images-outline",
      title: "Object Library",
      description: "Access thousands of furniture and decor items",
      free: true,
    },
    {
      icon: "save-outline",
      title: "Save Designs",
      description: "Save your room designs to gallery",
      free: true,
    },
    {
      icon: "star",
      title: "Premium Objects",
      description: "Access exclusive premium furniture and decor items",
      free: false,
      vip: true,
    },
    {
      icon: "cloud-upload-outline",
      title: "Cloud Sync",
      description: "Sync your designs across all devices",
      free: false,
      vip: true,
    },
    {
      icon: "remove-circle-outline",
      title: "No Watermarks",
      description: "Export images without watermarks",
      free: false,
      vip: true,
    },
    {
      icon: "infinite-outline",
      title: "Unlimited Designs",
      description: "Create unlimited room designs",
      free: false,
      vip: true,
    },
    {
      icon: "color-palette-outline",
      title: "Advanced Customization",
      description: "Advanced color and texture options",
      free: false,
      vip: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <HeaderMenu />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Explore our features and unlock your creativity
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon}
                  size={28}
                  color={feature.vip ? "#FFD700" : "#5d9680ff"}
                />
              </View>
              <View style={styles.featureContent}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  {feature.free ? (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                  ) : (
                    <View style={styles.vipBadge}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.vipBadgeText}>VIP</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* VIP Upgrade Card */}
        <View style={styles.vipCard}>
          <View style={styles.vipHeader}>
            <Ionicons name="diamond" size={40} color="#FFD700" />
            <Text style={styles.vipTitle}>Upgrade to VIP</Text>
          </View>
          <Text style={styles.vipDescription}>
            Unlock all premium features and take your room design to the next level!
          </Text>
          <View style={styles.vipBenefits}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Premium object library</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Cloud sync across devices</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>No watermarks</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Unlimited designs</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Advanced customization</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgradeToVIP}
          >
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.upgradeButtonText}>Upgrade to VIP</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue with Free Features</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* <AdminFab /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  featuresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  freeBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  vipBadgeText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "bold",
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  vipCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  vipHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  vipTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  vipDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  vipBenefits: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#5d9680ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

