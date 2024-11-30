import React from 'react';
import { View, Text, Button, StyleSheet, Linking, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Maps({ route, navigation }) {
  const { poi } = route.params; // Get POI details from navigation params

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url); // Open Google Maps for navigation
        } else {
          Alert.alert('Error', 'Google Maps is not available on this device.');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: poi.latitude,
          longitude: poi.longitude,
          latitudeDelta: 0.01, // Adjust zoom level
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: poi.latitude,
            longitude: poi.longitude,
          }}
          title={poi.name}
          description={poi.address}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Start Navigation" onPress={handleOpenGoogleMaps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
