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
      // Check if the selected team is already linked to the POI
      if (poi.team && poi.team._id === teamId) {
        Alert.alert(
          'Team Already Linked',
          'This team is already linked to the current POI. Please choose another team.'
        );
        return; // Exit the function early
      }
  
      // Proceed with linking the team
      const response = await apiClient.put(`/pois/${poi._id}/team`, { teamId });
  
      if (response.status === 200) {
        console.log('Team linked successfully:', teamId);
  
        // Update state and navigate to Detail screen
        setSelectedTeam(teamId);
        navigation.navigate('Detail', { poi, selectedTeam: teamId });
  
        Alert.alert('Success', 'Team has been linked to the POI!');
      } else {
        console.error('Error linking team to POI:', response.data.message);
      }
    } catch (error) {
      console.error('Error linking team:', error);
      Alert.alert(
        'Team Already Linked',
        'This team is already linked to the current POI. Please choose another team.'
      );    
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to POI Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light gray background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40', // Dark gray for better readability
  },
  teamItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff', // White card-like background
    borderRadius: 10, // Smooth rounded corners
    shadowColor: '#000', // Subtle shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Shadow for Android
  },
  teamName: {
    fontSize: 18,
    color: '#495057', // Subtle gray for text
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d', // Muted gray for "No teams available" text
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007bff', // Blue button color
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});