import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import AdminFab from "../components/AdminFab";

export default function StartScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365' }}
      style={styles.background}
      resizemode="contain"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Design Your Space. Effortlessly.</Text>
        <Text style={styles.subtitle}>
          From simple inspiration to 3D room planning and shopping, we turn your design vision into reality.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>

        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.activeDot]}></View>
          <View style={styles.dot}></View>
          <View style={styles.dot}></View>
          <View style={styles.dot}></View>
          <View style={styles.dot}></View>
        </View>

        <StatusBar style="light" />
        {/* <AdminFab /> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dark overlay for better text readability
    alignItems: 'center',
    justifyContent: 'flex-end', // Align content to the bottom
    padding: 20,
    paddingBottom: 50, // More padding at the bottom for the button and dots
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#6A9E9E',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    minWidth: '80%',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationDots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  container: { flex: 1 },
});
