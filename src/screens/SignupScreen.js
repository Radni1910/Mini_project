import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);

  // Google Auth Config
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "1077002044139-p8vavidm427buke0rs0vg8der23q0ghn.apps.googleusercontent.com",
    androidClientId:
      "1077002044139-ie5f2pn5rrurfquqb147sa3f9c9puu84.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace("Features"))
        .catch((err) => Alert.alert("Error", err.message));
    }
  }, [response]);

  const handleSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        updateProfile(userCred.user, { displayName: name });
        navigation.replace("Features");
      })
      .catch((err) => Alert.alert("Sign Up Error", err.message));
  };

  return (
    <ImageBackground
      source={require("../../assets/room.png")} // Place your image in /assets
      style={styles.bg}
      blurRadius={4}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign up</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="#000000ff"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#000000ff"
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#000000ff"
            secureTextEntry={showPassword}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#000"
              style={{ marginLeft: -35 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Log In
          </Text>
        </Text>

        <View style={styles.orContainer}>
          <View style={styles.line}></View>
          <Text style={styles.orText}>or</Text>
          <View style={styles.line}></View>
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
        >
          <Ionicons name="logo-google" size={20} color="#000" />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    // paddingRight: 1,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
  linkText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
  },
  link: {
    fontWeight: "bold",
    color: "#4AB3FF",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: { color: "#fff", marginHorizontal: 10 },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "500" },
});
