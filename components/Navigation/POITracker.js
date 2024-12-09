import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import apiClient from '../apiClient/api';

export default function POITracker({ route, navigation }) {
  const { poi, team } = route.params; // Extract the POI object passed via navigation
  const [hasReached, setHasReached] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [winningTeam, setWinningTeam] = useState(null);
  // const [selectedTeam, setSelectedTeam] = useState(null);


  // if (!team) {
  //   Alert.alert('Error', 'No team selected for this POI.');
  //   console.log("No team selected", team)
  //   return;
  // }
  
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



  const checkProximity = async () => {
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
      await fetchWinningTeam(); // Fetch the winning team
    } else {
      Alert.alert('Not Yet!', `You're ${distance} meters away.`);
    }
  };

  const fetchWinningTeam = async () => {
    try {
      console.log("Fetching team")
      const response = await apiClient.get(`/pois/${poi._id}/team`);
      console.log(response.data)
      if (response.status === 200) {
        console.log("Winning Team Fetched:", response.data.team[0]); // Log fetched data
        setWinningTeam(response.data.team[0]); // Assuming a single team is linked
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      Alert.alert('Error', 'Unable to fetch team details. Please try again.');
    }
  };
  useEffect(() => {
    console.log('Team passed to POITracker:', team);
  }, [team]);

  const markAsCompleted = async () => {
    const teamToUse = typeof team === 'string' ? { _id: team } : team; // Resolve `team`
    if (!teamToUse || !teamToUse._id) {
      console.error('Team data is missing or undefined:', teamToUse);
      Alert.alert('Error', 'Team information is required to mark POI as completed.');
      return;
    }
  
    try {
      const payload = {
        teamId: teamToUse._id,
        scoreIncrement: 10,
      };
      console.log('Sending payload to mark POI as completed:', payload);
  
      const response = await apiClient.put(`/pois/${poi._id}/complete`, payload);
      if (response.status === 200) {
        console.log('Response from backend:', response.data);
        Alert.alert('Success', 'POI marked as completed and score updated!');
        navigation.navigate('LeaderBoard');
      }
    } catch (error) {
      console.error('Error in markAsCompleted:', error.response?.data || error.message);
      Alert.alert('Error', 'Unable to mark POI as completed. Please try again.');
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
          {winningTeam && (
            <View style={styles.winnerContainer}>
              <Text style={styles.winnerTitle}>Winning Team:</Text>
              <Text style={styles.winnerName}>{winningTeam.name}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={markAsCompleted}>
          <Text style={styles.buttonText}>Mark as Completed</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.button} onPress={checkProximity}>
        <Text style={styles.buttonText}>Check Proximity</Text>
      </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa', // Light gray for a clean look
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40', // Dark gray for better readability
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d', // Muted gray for subtle text
    lineHeight: 24, // Improved readability
  },
  reachedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  congrats: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745', // Green for a success message
    textAlign: 'center',
    marginBottom: 20,
  },
  winnerContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffffff', // White card-like background
    borderRadius: 12, // Smooth rounded corners
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
    alignItems: 'center',
    width: '90%', // Adjust width for consistency
  },
  winnerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057', // Subtle gray for a polished look
  },
  winnerName: {
    fontSize: 16,
    color: '#007bff', // Blue for emphasis
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff', // Blue for primary buttons
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});

