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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  teamItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  teamName: {
    fontSize: 16,
  },
});
