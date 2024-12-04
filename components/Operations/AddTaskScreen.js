import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { POIContext } from '../SharedContext/TaskContext';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import apiClient from '../../components/apiClient/api'



export default function AddTaskScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [task, setTask] = useState('');
  const [tags, setTags] = useState('');
  const [rating, setRating] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);


  const { addPOI } = useContext(POIContext);
  const { refreshPOIs } = useContext(POIContext);


  // Fetch the user's current location when the component mounts
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permissions are required to get the current location.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log('Current Location:', location.coords);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch location. Ensure location services are enabled.');
        console.error(error);
      }
    };

    fetchLocation();
  }, []);

  const handleAddPOI = async () => {

    if (!currentLocation) {
      Alert.alert('Error', 'Location not available. Please try again.');
      return;
    }

    const newPOI = {
      id: Date.now().toString(), // Mock unique ID
      name,
      address,
      task,
      tags: tags.split(',').map(tag => tag.trim()),
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      rating: parseFloat(rating) || 0, // Default rating to 0 if not provided

    };

    try {
      
      // axios to make a POST request
      const response = await apiClient.post('/pois', newPOI)
      console.log("POI added: ", response.data);

      refreshPOIs();
     
      // addPOI(newPOI);
      console.log('New POI:', newPOI); // Replace with actual state or database update logic


      // setting the state empty after adding
      setName("");
      setAddress("");
      setTask("");
      setTags("");
      setRating("");
      setCurrentLocation("");

    } catch (error) {
      console.log("Error", error.message)
      
  }
    navigation.goBack(); // Return to HomeScreen

  };


  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter POI Name"
        requried
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter POI Address"
      />

      <Text style={styles.label}>Task Instructions:</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="Enter Task Instructions"
      />

      <Text style={styles.label}>Tags: </Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="e.g., Easy"
      />

    <Text style={styles.label}>Ratings: </Text>
    <TextInput
        style={styles.input}
        placeholder="Enter Rating"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Button title="Add POI" onPress={handleAddPOI} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    borderColor: '#ccc',
  },
});
