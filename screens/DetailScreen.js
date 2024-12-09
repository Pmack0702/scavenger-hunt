import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { POIContext } from '../components/SharedContext/TaskContext';
import { TeamContext } from '../components/SharedContext/TeamContext';

import apiClient from '../components/apiClient/api'


export default function DetailScreen({ route, navigation }) {
  
    // const { poi, setPOIs } = route.params; // Retrieve poi and setPOIs from navigation params

    const { poi, setPOIs, selectedTeam } = route.params || {};

  const { deletePOI } = useContext(POIContext); // Access the DELETEPOI from POIContext
  const { teams } = useContext(TeamContext); // Access available teams from TeamContext
  console.log("Teams receive from detailscrren" ,teams)
  console.log('Teams from Detail:', teams); // Log to debug


  const [isModalVisible, setIsModalVisible] = useState(false); // State to toggle modal visibility
  // const [selectedTeam, setSelectedTeam] = useState(null); // State to store selected team
  const [currentSelectedTeam, setCurrentSelectedTeam] = useState(selectedTeam || null); // Initialize state with selectedTeam

  console.log("detail from selectedTeam", selectedTeam)

  useEffect(() => {
    if (selectedTeam) {
      console.log('Selected Team Updated:', selectedTeam);
      setCurrentSelectedTeam(selectedTeam);
    }
  }, [selectedTeam]);
  
  
  if (!poi) {
    Alert.alert('Error', 'POI data is missing. Returning to the previous screen.');
    navigation.goBack();
    return null;
  }
  
  
  // Handle selecting a team for the POI
  const handleSelectTeam = async (teamId) => {
    try {
      // Check if the selected team is already linked to the POI
      if (poi.team && poi.team._id === teamId) {
        Alert.alert(
          'Team Already Linked',
          'This team is already linked to the current POI. Please choose another team.'
        );
        return; // Exit early
      }
  
      // Proceed with linking the team
      const response = await apiClient.put(`/pois/${poi._id}/team`, { teamId });
  
      if (response.status === 200) {
        console.log('Team linked successfully:', teamId);
  
        // Find the full team object for navigation
        const selectedTeam = teams.find((team) => team._id === teamId);
        navigation.navigate('Detail', { poi, selectedTeam });
  
        Alert.alert('Success', 'Team has been linked to the POI!');
      } else {
        console.error('Error linking team to POI:', response.data.message);
      }
    } catch (error) {
      console.error('Error linking team:', error);
      Alert.alert('Error', 'There was an issue linking the team to the POI. Please try again.');
    }
  };
  

  
  // Render team list item
  const renderTeamItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectTeam(item._id)}>
      <View style={styles.teamItem}>
        <Text style={styles.teamName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  
  console.log('Received POI in DetailScreen:', poi); // Debug POI

  

  const handleDeletePOI = () => {

    console.log('Deleting POI with ID:', poi._id); // Debugging log

      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this POI?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: async () => {
              // deletePOI();

              try {
                await deletePOI(poi._id); // Ensure `poi.id` exists
                navigation.goBack(); // Return to Home Screen
                
              } catch (error) {
                console.error('Error during deletion:', error);
              }
            },
          },
        ]
      );
    };


    
    
    const handleTrackLocation = () => {
      if (currentSelectedTeam) {

        console.log('Navigating to POITracker with:', { poi, team: currentSelectedTeam });
        navigation.navigate('POITracker', { poi, team: currentSelectedTeam });

      } else {
        console.log("No Team Selected")
        Alert.alert('No Team Selected', 'Please select a team before tracking the location.');
      }
    };
           {/* <View style={[styles.button]}>
          <Button 
              title="Edit POI" 
              // color="#28a745" 
              onPress={() => navigation.navigate('EditTask', { poi })} 
          />
        </View> */}
        
        {/* <View style={[styles.button]}>
          <Button title="Contact" onPress={() => navigation.navigate('Contact', { poi })} />
        </View> */}

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{poi.name}</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.text}>{poi.address}</Text>
      <Text style={styles.label}>Task Instructions:</Text>
      <Text style={styles.text}>{poi.task}</Text>
      <Text style={styles.label}>Tags:</Text>
      <Text style={styles.text}>{poi.tags.join(', ')}</Text>
      <Text style={styles.label}>Ratings: </Text>
      <Text style={styles.text}>{poi.rating}</Text>

      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SelectTeam', { poi, team: selectedTeam })}>
          <Text style={styles.buttonText}>Select Team</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDeletePOI}>
          <Text style={styles.buttonText}>Delete POI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Maps', { poi })}>
          <Text style={styles.buttonText}>View on Map</Text>
        </TouchableOpacity>

        {currentSelectedTeam && (
        <TouchableOpacity style={styles.button} onPress={handleTrackLocation}>
          <Text style={styles.buttonText}>Track Location</Text>
        </TouchableOpacity>
      )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to List</Text>
        </TouchableOpacity>



      </View>


        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light gray for a clean look
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#343a40', // Dark gray for a modern appearance
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#495057', // Subtle gray for label text
  },

  text: {
    fontSize: 16,
    marginTop: 4,
    color: '#6c757d', // Light gray for additional text
    lineHeight: 22, // Improve readability
  },

  button: {
    width: '90%',
    marginVertical: 8, // Space between buttons
    backgroundColor: '#007bff', // Blue for primary buttons
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
    textAlign: 'center',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center buttons horizontally
    marginTop: 20, // Push buttons below the content
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent overlay
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40', // Darker text for prominence
  },

  teamItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef', // Subtle border for separation
    backgroundColor: '#f8f9fa', // Light background for team items
    borderRadius: 8,
    marginBottom: 8,
  },

  teamName: {
    fontSize: 18,
    color: '#495057', // Subtle text color
    fontWeight: 'bold',
  },
});
