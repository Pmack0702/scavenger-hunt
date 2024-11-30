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
      <Text>Welcome to the Scavenger Hunt!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
