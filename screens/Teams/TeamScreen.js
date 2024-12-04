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
        console.log('After adding team:', teams); // Log after adding
        

    };

    const renderItem = ({ item }) => {
        console.log(item); // Check if item contains a name
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('AddMember', { team: item })} // Pass team to AddMember
            >
                <Text style={styles.teamName}>{item.name}</Text>
            </TouchableOpacity>
        );
    };
    
    // Navigate to AddMemberScreen with team data
    // const handleTeamClick = (team) => {
    //     navigation.navigate('AddMember', { team }); // Pass team as a parameter
    // };

    // const renderItem = ({ item }) => (
    //     <TouchableOpacity onPress={() => handleTeamClick(item)} style={styles.teamItem}>
    //         <Text style={styles.teamName}>{item.name}</Text>
    //     </TouchableOpacity>
    // );

    useEffect(() => {
        console.log('Teams updated:', teams);
    }, [teams]);  // This will log when teams is updated
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Teams</Text>

        {/* <Text style={styles.teamName}>{item.name}</Text> */}
          
        {teams.length > 0 ? (
            <FlatList
                data={teams}
                keyExtractor={(item) => item._id ? item._id.toString() : item.name}  // Fallback to item.name if _id is missing
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
          <Button title="Add Team" onPress={handleAddTeam} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: '#fff' },
        header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
        input: { padding: 8, borderWidth: 1, marginBottom: 16, borderRadius: 4 },
        teamItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
        teamName: { fontSize: 18, fontWeight: 'bold', color: "black" },
        item: { padding: 16, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
    });
    