import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { setVipStatus, getVipUsers, isVipEmail, isAdminEmail } from "../config/vip";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_SESSION_KEY = "@admin_session";

const FEATURE_FLAGS_KEY = "@feature_flags";
const AUDIT_LOG_KEY = "@audit_log";

// Get feature flags
async function getFeatureFlags() {
  try {
    const data = await AsyncStorage.getItem(FEATURE_FLAGS_KEY);
    return data ? JSON.parse(data) : { newUI: false };
  } catch (error) {
    console.error("Error getting feature flags:", error);
    return { newUI: false };
  }
}

// Save feature flags
async function saveFeatureFlags(flags) {
  try {
    await AsyncStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(flags));
  } catch (error) {
    console.error("Error saving feature flags:", error);
  }
}

// Add audit log entry
async function addAuditLog(action, details) {
  try {
    const logs = await getAuditLogs();
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      adminEmail: auth.currentUser?.email || "Unknown",
      action,
      details,
    };
    logs.unshift(newLog);
    // Keep only last 100 logs
    const limitedLogs = logs.slice(0, 100);
    await AsyncStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(limitedLogs));
  } catch (error) {
    console.error("Error adding audit log:", error);
  }
}

// Get audit logs
async function getAuditLogs() {
  try {
    const data = await AsyncStorage.getItem(AUDIT_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting audit logs:", error);
    return [];
  }
}

export default function AdminScreen({ navigation }) {
  const [searchEmail, setSearchEmail] = useState("");
  const [userVipStatus, setUserVipStatus] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [featureFlags, setFeatureFlags] = useState({ newUI: false });
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // users, features, logs
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      // Check if admin session exists
      const session = await AsyncStorage.getItem(ADMIN_SESSION_KEY);
      const user = auth.currentUser;
      
      if (session && user && isAdminEmail(user.email)) {
        setIsAuthorized(true);
        loadFeatureFlags();
        loadAuditLogs();
      } else {
        // Not authorized, redirect to login
        navigation.replace("AdminLogin");
      }
    } catch (error) {
      console.error("Error checking admin auth:", error);
      navigation.replace("AdminLogin");
    }
  };

  const loadFeatureFlags = async () => {
    const flags = await getFeatureFlags();
    setFeatureFlags(flags);
  };

  const loadAuditLogs = async () => {
    const logs = await getAuditLogs();
    setAuditLogs(logs);
  };

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    setIsSearching(true);
    try {
      const normalized = searchEmail.trim().toLowerCase();
      const isVip = await isVipEmail(normalized);
      setUserVipStatus(isVip);
    } catch (error) {
      Alert.alert("Error", "Failed to search user");
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleVip = async () => {
    if (!searchEmail.trim()) {
      Alert.alert("Error", "Please search for a user first");
      return;
    }

    const newStatus = !userVipStatus;
    const normalized = searchEmail.trim().toLowerCase();

    try {
      await setVipStatus(normalized, newStatus);
      setUserVipStatus(newStatus);
      
      // Add audit log
      await addAuditLog(
        newStatus ? "GRANT_VIP" : "REVOKE_VIP",
        { email: normalized, previousStatus: userVipStatus, newStatus }
      );

      Alert.alert(
        "Success",
        `VIP status ${newStatus ? "granted" : "revoked"} for ${normalized}`
      );
      
      // Reload audit logs
      loadAuditLogs();
    } catch (error) {
      Alert.alert("Error", "Failed to update VIP status");
    }
  };

  const handleToggleFeatureFlag = async (flagName) => {
    const newFlags = {
      ...featureFlags,
      [flagName]: !featureFlags[flagName],
    };
    
    try {
      await saveFeatureFlags(newFlags);
      setFeatureFlags(newFlags);
      
      // Add audit log
      await addAuditLog(
        "TOGGLE_FEATURE_FLAG",
        { flagName, newValue: newFlags[flagName] }
      );

      Alert.alert("Success", `Feature flag ${flagName} ${newFlags[flagName] ? "enabled" : "disabled"}`);
      
      // Reload audit logs
      loadAuditLogs();
    } catch (error) {
      Alert.alert("Error", "Failed to update feature flag");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isAuthorized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="shield-checkmark" size={48} color="#d9534f" />
          <Text style={styles.loadingText}>Verifying admin access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="shield-checkmark" size={20} color="#d9534f" />
          <Text style={styles.title}>Admin Panel</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem(ADMIN_SESSION_KEY);
            navigation.replace("Welcome");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.tabActive]}
          onPress={() => setActiveTab("users")}
        >
          <Ionicons
            name="people"
            size={18}
            color={activeTab === "users" ? "#d9534f" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "users" && styles.tabTextActive,
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "features" && styles.tabActive]}
          onPress={() => setActiveTab("features")}
        >
          <Ionicons
            name="flag"
            size={18}
            color={activeTab === "features" ? "#d9534f" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "features" && styles.tabTextActive,
            ]}
          >
            Features
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "logs" && styles.tabActive]}
          onPress={() => setActiveTab("logs")}
        >
          <Ionicons
            name="document-text"
            size={18}
            color={activeTab === "logs" ? "#d9534f" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "logs" && styles.tabTextActive,
            ]}
          >
            Audit Log
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Users Tab */}
        {activeTab === "users" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Manage User VIP Status</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by email"
                  placeholderTextColor="#999"
                  value={searchEmail}
                  onChangeText={setSearchEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearchUser}
                  disabled={isSearching}
                >
                  <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {searchEmail.trim() && (
                <View style={styles.userStatusCard}>
                  <View style={styles.userInfo}>
                    <Ionicons name="person" size={24} color="#333" />
                    <View style={styles.userDetails}>
                      <Text style={styles.userEmail}>{searchEmail}</Text>
                      <Text style={styles.userStatus}>
                        Status: {userVipStatus ? "VIP" : "Normal"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>
                      {userVipStatus ? "VIP" : "Normal"}
                    </Text>
                    <Switch
                      value={userVipStatus}
                      onValueChange={handleToggleVip}
                      trackColor={{ false: "#ccc", true: "#FFD700" }}
                      thumbColor={userVipStatus ? "#fff" : "#f4f3f4"}
                    />
                  </View>
                </View>
              )}
          </View>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Feature Flags</Text>
            <Text style={styles.cardSubtitle}>
              Toggle features on/off for all users
            </Text>

            <View style={styles.featureItem}>
              <View style={styles.featureInfo}>
                <Ionicons name="sparkles" size={24} color="#5d9680ff" />
                <View style={styles.featureDetails}>
                  <Text style={styles.featureName}>New UI</Text>
                  <Text style={styles.featureDescription}>
                    Enable the new user interface design
                  </Text>
                </View>
              </View>
              <Switch
                value={featureFlags.newUI || false}
                onValueChange={() => handleToggleFeatureFlag("newUI")}
                trackColor={{ false: "#ccc", true: "#5d9680ff" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        )}

        {/* Audit Log Tab */}
        {activeTab === "logs" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Audit Log</Text>
            <Text style={styles.cardSubtitle}>
              Recent admin actions ({auditLogs.length} entries)
            </Text>

            {auditLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No audit logs yet</Text>
              </View>
            ) : (
              auditLogs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <Ionicons
                      name={
                        log.action === "GRANT_VIP"
                          ? "add-circle"
                          : log.action === "REVOKE_VIP"
                          ? "remove-circle"
                          : "flag"
                      }
                      size={20}
                      color="#d9534f"
                    />
                    <Text style={styles.logAction}>{log.action}</Text>
                    <Text style={styles.logTime}>
                      {formatTimestamp(log.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.logAdmin}>Admin: {log.adminEmail}</Text>
                  <Text style={styles.logDetails}>
                    {JSON.stringify(log.details, null, 2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#d9534f",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#d9534f",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchButton: {
    backgroundColor: "#d9534f",
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  userStatusCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: "#666",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  featureInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  featureDetails: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
  logItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#d9534f",
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  logAction: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d9534f",
    flex: 1,
  },
  logTime: {
    fontSize: 12,
    color: "#999",
  },
  logAdmin: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});
