import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Start'); // Navigate to StartScreen after 2.5s
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')} // place your image in /assets
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // light gray background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 400,  // adjust based on your image size
    height: 400,
  },
});
