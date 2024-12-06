import React, { useState, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TeamContext } from '../../components/SharedContext/TeamContext';
import apiClient from '../../components/apiClient/api'; // API client for making requests

export default function SelectTeamScreen({ route, navigation }) {
  const { poi } = route.params; // Retrieve POI passed via navigation
  const { teams } = useContext(TeamContext); // Access available teams from TeamContext
  console.log('Teams from context in SelectTeamScreen:', teams);

  const [selectedTeam, setSelectedTeam] = useState(null);
  console.log("Team Selected",selectedTeam)

  // Handle selecting a team
  const handleSelectTeam = async (teamId) => {
    try {
      const response = await apiClient.put(`/pois/${poi._id}/team`, { teamId });
      if (response.status === 200) {
        console.log('Team Selected:', teamId); // Log the selected team ID
        setSelectedTeam(teamId); // Update state
        Alert.alert('Success', 'Team has been linked to the POI!');
        // navigation.goBack(); // Or use navigation.navigate if DetailScreen is accessible
        navigation.navigate('Detail', { poi, selectedTeam: teamId }); // Pass both `poi` and `selectedTeam`
        console.log('Navigating to DetailScreen with:', { poi, selectedTeam: teamId });

      } else {
        console.error('Error linking team to POI:', response.data.message);
      }
    } catch (error) {
      console.error('Error linking team:', error);
      Alert.alert('Error', 'There was an issue linking the team to the POI.');
    }
  };
  

  const renderTeamItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectTeam(item._id)}>
      <View style={styles.teamItem}>
        <Text style={styles.teamName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Team for POI: {poi.name}</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderTeamItem}
        ListEmptyComponent={<Text>No teams available.</Text>} // If no teams, show this
      />
      <Button title="Back to POI Details" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light background for a clean and modern look
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#343a40', // Dark gray for better visibility
  },
  teamItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff', // White card-like background
    borderRadius: 8, // Rounded corners
    shadowColor: '#000', // Subtle shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android
  },
  teamName: {
    fontSize: 18,
    color: '#495057', // Subtle gray for text
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d', // Muted gray for "No teams available" text
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007bff', // Blue button color
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

