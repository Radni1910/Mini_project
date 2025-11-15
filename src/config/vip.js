import AsyncStorage from "@react-native-async-storage/async-storage";

// VIP email configuration. Add emails that should be treated as VIP.
export const VIP_EMAILS = [
  // Replace or append with your VIP emails
  // "vip@example.com",
  "radniamonkar@gmail.com",
];

// Admin email configuration. Exactly 2 master admins.
export const ADMIN_EMAILS = [
  "vpg@gmail.com", // Professor admin
  "radniamonkar@gmail.com", // Student admin (project owner)
];

// Admin credentials (email -> password)
export const ADMIN_CREDENTIALS = {
  "vpg@gmail.com": "123456",
  "radniamonkar@gmail.com": "admin123", // Change this password as needed
};

// Verify admin credentials
export function verifyAdminCredentials(email, password) {
  if (!email || !password) return false;
  const normalized = String(email).trim().toLowerCase();
  const storedPassword = ADMIN_CREDENTIALS[normalized];
  return storedPassword === password;
}

const VIP_STORAGE_KEY = "@vip_users";

// Save VIP status for a user
export async function setVipStatus(email, isVip = true) {
  if (!email) return;
  try {
    const normalized = String(email).trim().toLowerCase();
    const vipUsers = await getVipUsers();
    if (isVip) {
      if (!vipUsers.includes(normalized)) {
        vipUsers.push(normalized);
        await AsyncStorage.setItem(VIP_STORAGE_KEY, JSON.stringify(vipUsers));
      }
    } else {
      const updated = vipUsers.filter((e) => e !== normalized);
      await AsyncStorage.setItem(VIP_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Error saving VIP status:", error);
  }
}

// Get list of VIP users from AsyncStorage
export async function getVipUsers() {
  try {
    const data = await AsyncStorage.getItem(VIP_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting VIP users:", error);
    return [];
  }
}

// Check if email is VIP (checks both static list and AsyncStorage)
export async function isVipEmail(email) {
  if (!email) return false;
  const normalized = String(email).trim().toLowerCase();
  
  // Check static VIP list
  if (VIP_EMAILS.map((e) => e.toLowerCase()).includes(normalized)) {
    return true;
  }
  
  // Check AsyncStorage
  try {
    const vipUsers = await getVipUsers();
    return vipUsers.includes(normalized);
  } catch (error) {
    console.error("Error checking VIP status:", error);
    return false;
  }
}

// Synchronous version for use in components (checks static list only)
export function isVipEmailSync(email) {
  if (!email) return false;
  const normalized = String(email).trim().toLowerCase();
  return VIP_EMAILS.map((e) => e.toLowerCase()).includes(normalized);
}

export function isAdminEmail(email) {
  if (!email) return false;
  const normalized = String(email).trim().toLowerCase();
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(normalized);
}
