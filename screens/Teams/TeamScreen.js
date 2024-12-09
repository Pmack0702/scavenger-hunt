import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TeamContext } from '../../components/SharedContext/TeamContext';
import { useFocusEffect } from '@react-navigation/native';


export default function TeamScreen({ navigation }) {

    const { teams, addTeam, fetchTeams } = useContext(TeamContext); // Access addTeam method from context
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState('');

     // Refresh data when screen gains focus
     useFocusEffect(
        React.useCallback(() => {
          fetchTeams();
        }, [])
      );

    // Handle adding a new team
    const handleAddTeam = async () => {
        if (teamName.trim() === '') return; // Prevent adding empty team name
        const newTeam = { name: teamName, members: [] }; // Example new team structure
        console.log('Before adding team:', teams); // Log before adding
        await addTeam(newTeam);
        fetchTeams();
        setTeamName('')
        console.log('After adding team:', teams); // Log after adding 

    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                
                onPress={() => navigation.navigate('AddMember', { team: item })} // Pass team to AddMember
            >
                <Text style={styles.teamName}>{item.name}</Text>
            </TouchableOpacity>
        );
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Teams</Text>

        {/* <Text style={styles.teamName}>{item.name}</Text> */}
          
        {teams.length > 0 ? (
            <FlatList
                data={teams}
                keyExtractor={(item) => item._id}  // Fallback to item.name if _id is missing
                renderItem={renderItem}
            />
        ) : (
            <Text>No teams available</Text>
        )}

          
          <TextInput
            style={styles.input}
            placeholder="Enter team name"
            value={teamName}
            onChangeText={(text) => setTeamName(text)} // Corrected this line
          />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTeam}>
            <Text style={styles.addButtonText}>Add Team</Text>
        </TouchableOpacity>
    </View>
      );
    }
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
          backgroundColor: '#f8f9fa', // Light background for a modern look
        },
        header: {
          fontSize: 26,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
          color: '#343a40', // Dark gray for visibility
        },
        input: {
          padding: 12,
          borderWidth: 1,
          borderColor: '#ccc', // Subtle border color
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 16,
          fontSize: 16,
        },
        item: {
          padding: 16,
          marginBottom: 12,
          backgroundColor: '#ffffff', // White card-like background
          borderRadius: 8,
          shadowColor: '#000', // Subtle shadow for depth
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3, // Shadow for Android
        },
        teamName: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#495057', // Subtle gray for team names
        },
        emptyText: {
          fontSize: 16,
          color: '#6c757d', // Muted gray for "No teams available" text
          textAlign: 'center',
          marginTop: 20,
        },
        addButton: {
          backgroundColor: '#007bff', // Blue for primary button
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
        },
        addButtonText: {
          color: '#fff', // White text for button
          fontSize: 16,
          fontWeight: 'bold',
        },
      });