// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
    
    useEffect(() => {

      setTimeout(() => {
          navigation.replace('HomeScreen')
      }, 2000)

    },[navigation])

  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Welcome to the Scavenger Hunt!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34', // A clean background color
  },
  Text: {
    fontSize: 24, // Larger text size for visibility
    fontWeight: 'bold',
    color: '#ffffff', // White text for contrast
    textAlign: 'center',
    paddingHorizontal: 20, // Padding for better spacing on smaller screens
  },
});


export default SplashScreen;
