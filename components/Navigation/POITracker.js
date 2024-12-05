import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button, StyleSheet } from 'react-native';
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

  const fetchWinningTeam = async () => {
    try {
      console.log("Fetching team")
      const response = await apiClient.get(`/pois/${poi._id}/team`);
      console.log(response.data)
      if (response.status === 200) {
        setWinningTeam(response.data.team[0]); // Assuming a single team is linked
        console.log(winningTeam)
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      Alert.alert('Error', 'Unable to fetch team details. Please try again.');
    }
  };

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
      Alert.alert('Not Yet!', `You’re ${distance} meters away.`);
    }
  };

  const markAsCompleted = async () => {
    try {
      const response = await apiClient.put(`/pois/${poi._id}/complete`, {
        teamId: team._id,
        scoreIncrement: 10, // Adjust score increment as needed
      });
      if (response.status === 200) {
        Alert.alert('Success', 'POI marked as completed and score updated!');
        navigation.navigate('LeaderBoard'); // Redirect to LeaderBoard
      }
    } catch (error) {
      console.error('Error marking POI as completed:', error);
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
          <Button title="Mark as Completed" onPress={markAsCompleted} />
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
  winnerContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  winnerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 16,
    color: '#007bff',
  },
});
