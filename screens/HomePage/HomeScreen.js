import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { POIContext } from '../../components/SharedContext/TaskContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import apiClient from '../../components/apiClient/api'
import { useFocusEffect } from '@react-navigation/native';



export default function HomeScreen({ navigation }) {

    const { pois, refreshPOIs } = useContext(POIContext); // Access the shared POI list
    // const [poislist, setpoislist] = useState([]) // store the pois list which will be used later to display on homescreeen

      // Refresh data when screen gains focus
      useFocusEffect(
        React.useCallback(() => {
          refreshPOIs();
        }, [])
      );

      // Set up the team icon in the header
      React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Team')} // Navigate to TeamScreen when clicked
              style={styles.iconContainer}
            >

              <Icon name="users" size={24} color="#000" /> Using the 'users' icon for teams
            </TouchableOpacity>
          ),
        });
      }, [navigation]);
  


  const renderItem = ({ item }) => (

    item && (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Detail', { poi: item })}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.tags?.join(', ') || ''} | {item.rating || 0}⭐
        </Text>
      </TouchableOpacity>

    )
  );

  return (
    <View style={styles.container}>


      <FlatList
        data={pois}
        keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
        renderItem={renderItem}
      />

    <View style={styles.buttonsContainer}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.buttonText}>Add POI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LeaderBoard')}
        >
          <Text style={styles.buttonText}>LeaderBoard</Text>
        </TouchableOpacity>
        
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f7', // Light background for a clean look
  },
  item: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff', // White card-like background
    borderRadius: 12, // Smooth rounded corners
    shadowColor: '#000', // Subtle shadow for a floating effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android shadow
  },
  name: {
    fontSize: 20, // Slightly larger font size for better visibility
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
  },
  details: {
    color: '#666', // Subtle gray for secondary text
    fontSize: 14,
    marginTop: 6, // Spacing between name and details
  },
  iconContainer: {
    marginRight: 16,
    padding: 8,
    backgroundColor: '#e0e0e0', // Subtle background for the icon
    borderRadius: 50, // Circular container for the icon
  },
  buttonsContainer: {
    flexDirection: 'row', // Place buttons side by side
    justifyContent: 'space-between', // Space between the buttons
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 16, // Position at the bottom
    width: '100%',
    backgroundColor: '#f0f4f7', // Matches the background color
  },
  button: {
    flex: 1, // Equal space for each button
    marginHorizontal: 8,
    backgroundColor: '#0066cc', // Primary blue color
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', // White text for buttons
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

