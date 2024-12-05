import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TeamContext } from '../../../components/SharedContext/TeamContext'; // Import TeamContext
import { Alert } from 'react-native';


export default function AddMemberScreen({ route, navigation }) {
  const { team } = route.params; // Get the selected team from the route
//   console.log('Selected team:', team); // Log the team to check its value

    if (!team) {
        return <Text>Team data is not available</Text>; // Render a fallback message if no team is passed
    }

    const { addMember, removeMember, deleteTeam } = useContext(TeamContext); // Access the addMember function from context
    const [member, setMembers] = useState(''); // New member input
  
    // Handle adding a new member to the team
    const handleAddMember = async () => {
    if (member.trim() === '') return; // Prevent adding empty member name
    const newMember = { name: member, id: Math.random().toString() }; // Example member structure
    try {
        await addMember(team._id, newMember); // Add member to context and API
        console.log("added successfully")
        
        setMembers(''); // Clear input field
    } catch (error) {
        console.error('Error adding member to team:', error);  // Log the error
    }
    };

     // Handle member deletion
    const handleDeleteMember = (memberId) => {
        // Show confirmation alert
        Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this member?",
        [
            {
            text: "Cancel",
            style: "cancel"
            },
            {
            text: "Yes",
            onPress: () => {
                removeMember(team._id, memberId); // Call the delete member function
                console.log("Deleted Succesfully")
            }
            }
        ]
        );
    };

    const handleDeleteTeam = () => {

        console.log('Deleting Team with ID:', team._id); // Debugging log
    
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
                    await deleteTeam(team._id); // Ensure `poi.id` exists
                    navigation.goBack(); // Return to Home Screen
                    
                  } catch (error) {
                    console.error('Error during deletion:', error);
                  }
                },
              },
            ]
          );
        };

    const renderMember = ({ item }) => (
        <TouchableOpacity onPress={() => handleDeleteMember(item._id)} style={styles.memberItem}>
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>{item.name}</Text>
          </View>
        </TouchableOpacity>
    );


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Members of {team.name}</Text>
      
      <FlatList
        data={team.members}
        keyExtractor={(item) => item._id}
        renderItem={renderMember}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter member name"
        value={member}
        onChangeText={setMembers}
      />

      <Button title="Add Member" onPress={handleAddMember} />
      <View style={[styles.button]}>
          <Button
              title="Delete Team"
              color="red"
              onPress={handleDeleteTeam}
              // onPress={() => handleDeletePOI(poi.id)}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { padding: 8, borderWidth: 1, marginBottom: 16, borderRadius: 4 },
  memberItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  memberName: { fontSize: 18 },

  button: {
    width: '100%',
    marginVertical: 4, // Space between buttons
    borderRadius: 8,
  },

});