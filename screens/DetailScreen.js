import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Alert } from 'react-native';
import { POIContext } from '../components/SharedContext/TaskContext';


export default function DetailScreen({ route, navigation }) {
    // const { poi, setPOIs } = route.params; // Retrieve poi and setPOIs from navigation params

  const { poi, setPOIs } = route.params; // Extract the POI object passed via navigation

  const { deletePOI } = useContext(POIContext); // Access the DELETEPOI from POIContext

const handleDeletePOI = () => {

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this POI?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {

            deletePOI(poi.id); // call the deletePOI from context
            // setPOIs((prevPOIs) => prevPOIs.filter((item) => item.id !== poi.id)); // Remove POI
            navigation.goBack(); // Return to Home Screen
          },
        },
      ]
    );
  };

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

        <View style={[styles.button]}>
          <Button 
              title="Edit POI" 
              // color="#28a745" 
              onPress={() => navigation.navigate('EditTask', { poi })} 
          />
        </View>

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
            onPress={() => navigation.navigate('POITracker', { poi })}
          />
        </View>

        <View style={[styles.button]}>
          <Button title="Contact" onPress={() => navigation.navigate('Contact', { poi })} />
        </View>

        <View style={[styles.button]}>
          <Button title="Back to List" onPress={() => navigation.goBack()} />
        </View>



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

});
