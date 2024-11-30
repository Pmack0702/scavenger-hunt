import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { POIContext } from '../SharedContext/TaskContext';

export default function AddTaskScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [task, setTask] = useState('');
  const [tags, setTags] = useState('');
  const [rating, setRating] = useState('');

  const { addPOI } = useContext(POIContext);


  const handleAddPOI = () => {
    const newPOI = {
      id: Date.now().toString(), // Mock unique ID
      name,
      address,
      task,
      tags: tags.split(',').map(tag => tag.trim()),
      latitude: 0, // Placeholder (use real data)
      longitude: 0, // Placeholder (use real data)
    };

    console.log('New POI:', newPOI); // Replace with actual state or database update logic
    addPOI(newPOI);
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

      <Text style={styles.label}>Tags (comma-separated):</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="e.g., Outdoor, Easy"
      />

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
