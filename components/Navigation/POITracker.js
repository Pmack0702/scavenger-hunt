import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button,StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

export default function POITracker({ route }) {

    const { poi } = route.params; // Extract the POI object passed via navigation
    const [hasReached, setHasReached] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);



  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    };

    fetchLocation();
  }, []);

  const checkProximity = () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available.');
      return;
    }

    const distance = getDistance(
      { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
      { latitude: poi.latitude, longitude: poi.longitude }
    );

    if (distance <= 50) {
        setHasReached(true);
      Alert.alert('Congratulations!', 'You’ve reached the location!');
    } else {
      Alert.alert('Not Yet!', `You’re ${distance} meters away.`);
    }
  };

  return (
    <View style={styles.container}>

        <Text style={styles.title}>{poi.name}</Text>
        <Text style={styles.description}>
            {poi.task || 'No description available for this location.'}
        </Text>

        {hasReached ? (
        <View>
            <Text style={styles.congrats}>You’ve reached the location!</Text>
            <Button title="Mark as Completed" onPress={() => navigation.goBack()} />
        </View>
        ) : (
        <Button title="Check Proximity" onPress={checkProximity} />
        )}

  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    poiName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    button: {
      marginTop: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#555',
    },    
    congrats: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
        marginBottom: 16,
    },
  });
  