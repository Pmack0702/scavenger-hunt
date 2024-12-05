import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { Alert } from 'react-native';
import { POIContext } from '../components/SharedContext/TaskContext';
import { TeamContext } from '../components/SharedContext/TeamContext';

import apiClient from '../components/apiClient/api'


export default function DetailScreen({ route, navigation }) {
  
    // const { poi, setPOIs } = route.params; // Retrieve poi and setPOIs from navigation params

  const { poi, setPOIs } = route.params; // Extract the POI object passed via navigation

  const { deletePOI } = useContext(POIContext); // Access the DELETEPOI from POIContext
  const { teams } = useContext(TeamContext); // Access available teams from TeamContext
  console.log("Teams receive from detailscrren" ,teams)
  console.log('Teams from Detail:', teams); // Log to debug


  const [isModalVisible, setIsModalVisible] = useState(false); // State to toggle modal visibility
  const [selectedTeam, setSelectedTeam] = useState(null); // State to store selected team

  // useEffect(() => {
  //   console.log('Updated selectedTeam:', selectedTeam);
  // }, [selectedTeam]);
  
  
  // Handle selecting a team for the POI
  const handleSelectTeam = async (teamId) => {
    try {
      const response = await apiClient.put(`/pois/${poi._id}/team`, { teamId });
      if (response.status === 200) {
        console.log('Selected Team:', teamId);
        setSelectedTeam(teamId); // Set selected team ID
        Alert.alert('Success', 'Team has been linked to the POI!');
      } else {
        console.error('Error linking team to POI:', response.data.message);
      }
    } catch (error) {
      console.error('Error linking team:', error);
      Alert.alert('Error', 'There was an issue linking the team to the POI.');
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

    // useEffect(() => {
    //   console.log('Received POI:', poi);
    //   console.log('Received Team:', teams);
    // }, []);
    
    

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

        <View style={styles.button}>
          <Button
            title="Select Team"
            onPress={() => navigation.navigate('SelectTeam', { poi, team: selectedTeam })}           />
        </View>

        {/* <View style={[styles.button]}>
          <Button 
              title="Edit POI" 
              // color="#28a745" 
              onPress={() => navigation.navigate('EditTask', { poi })} 
          />
        </View> */}

        <View style={[styles.button]}>
          <Button
              title="Delete POI"
              color="red"
              onPress={handleDeletePOI}
              // onPress={() => handleDeletePOI(poi.id)}
          />
        </View>

        <View style={[styles.button]}>
          <Button
              title="View on Map"
              color="#17a2b8"
              onPress={() => navigation.navigate('Maps', { poi })} // Pass POI to MapScreen
          />
        </View>


        <View style={[styles.button]}>
        <Button
          title="Track Location"
          color="#6c757d"
          onPress={() => {
            if (selectedTeam) {
              console.log('Navigating to POITracker with:', { poi, team: selectedTeam });
              navigation.navigate('POITracker', { poi, team: selectedTeam });
            } else {
              console.log("TroubleSHoot")
              Alert.alert('No Team Selected', 'Please select a team before tracking the location.');
            }
          }}
        />
        </View>

        {/* <View style={[styles.button]}>
          <Button title="Contact" onPress={() => navigation.navigate('Contact', { poi })} />
        </View> */}

        <View style={[styles.button]}>
          <Button title="Back to List" onPress={() => navigation.goBack()} />
        </View>

      {/* Modal for Team Selection */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Team</Text>
            <FlatList
            data={teams && teams.length > 0 ? teams : []} // Check if teams are available and have data
            keyExtractor={(item) => item._id.toString()}  // Ensure teams have _id property
            renderItem={renderTeamItem}  // Render each team item
          />
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal> */}



      </View>


        
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
    marginBottom: 10,
    textAlign: 'center',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    marginTop: 4,
    color: '#555',
  },

  button: {
    width: '100%',
    marginVertical: 4, // Space between buttons
    backgroundColor: '#007bff', // Blue button color
    borderRadius: 8,
    padding: 10,
  },

  buttonContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', // Center buttons horizontally
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
