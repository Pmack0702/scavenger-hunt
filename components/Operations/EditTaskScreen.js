import React, { useContext, useState } from 'react';
import { POIContext } from '../SharedContext/TaskContext';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import apiClient from '../apiClient/api'


export default function EditTaskScreen({ route, navigation }) {

    
    const { poi } = route.params;
  
    const [name, setName] = useState(poi.name);
    const [address, setAddress] = useState(poi.address);
    const [task, setTask] = useState(poi.task);
    const [tags, setTags] = useState(poi.tags.join(', '));

    const { editPOI } = useContext(POIContext);

  
    const handleSavePOI = () => {   
      const updatedPOI = {
        ...poi,
        name,
        address,
        task,
        tags: tags.split(',').map(tag => tag.trim()),
      };

  
      console.log('POI Updated:', updatedPOI);
      editPOI(updatedPOI);
      navigation.navigate('HomeScreen'); // Return to the previous screen

    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter POI Name" />
  
        <Text style={styles.label}>Address:</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter Address" />
  
        <Text style={styles.label}>Task Instructions:</Text>
        <TextInput style={styles.input} value={task} onChangeText={setTask} placeholder="Enter Task Instructions" />
  
        <Text style={styles.label}>Tags (comma-separated):</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="e.g., Outdoor, Easy" />
  
        <Button title="Save POI" onPress={handleSavePOI} />
      </View>
    );
  }

const styles = StyleSheet.create({

    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#ffffff', // White background for clean look
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333333', // Dark text color for better readability
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#cccccc', // Light gray border
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#f9f9f9', // Subtle background color for input fields
      marginBottom: 16, // Spacing between input fields
    },
    button: {
      marginTop: 16,
      backgroundColor: '#4CAF50', // Green button color
      padding: 12,
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 16,
      color: '#ffffff', // White text for contrast
      textAlign: 'center',
      fontWeight: 'bold',
    },
});
  