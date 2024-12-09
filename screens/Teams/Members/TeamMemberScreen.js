import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Communications from 'react-native-communications';
import { TeamContext } from '../../../components/SharedContext/TeamContext';
import { useFocusEffect } from '@react-navigation/native';


export default function AddMemberScreen({ route, navigation }) {
    


    const { team } = route.params;
    console.log('Route params:', route.params);
console.log('Team received in AddMemberScreen:', team);

     // Refresh data when screen gains focus
     useFocusEffect(
        React.useCallback(() => {
          fetchMembers(team._id);
        }, [])
      );

    if (!team) {
        return <Text>Team data is not available</Text>;
    }

    const { addMember, removeMember, deleteTeam, fetchMembers } = useContext(TeamContext);
    const [member, setMembers] = useState('');
    const [email, setEmail] = useState('');


    
    
    const handleAddMember = async () => {
        if (member.trim() === '' || email.trim() === '') {
            Alert.alert('Error', 'Name and Email are required.');
            return;
        }
        const newMember = { name: member, email: email, id: Math.random().toString() };
        try {
            await addMember(team._id, newMember);
            const updatedMembers = await fetchMembers(team._id);
            setMembers(updatedMembers); // Update local members state
            setEmail('');
        } catch (error) {
            console.error('Error adding member to team:', error);
        }
    };

    const handleDeleteMember = (memberId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this member?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        
                        removeMember(team._id, memberId)
                        const updatedMembers = await fetchMembers(team._id);
                        setMembers(updatedMembers); // Update local members state


                    },
                },
            ]
        );
    };

    const handleDeleteTeam = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this team?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await deleteTeam(team._id);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error during deletion:', error);
                        }
                    },
                },
            ]
        );
    };

    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            <TouchableOpacity
                style={styles.memberInfo}
                onPress={() => showContactOptions(item)} // Trigger the function
            >
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberContact}>{item.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMember(item._id)} // Delete member
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
    

    const showContactOptions = (member) => {
        Alert.alert(
            `Contact ${member.name}`,
            'Choose an option:',
            [
                { text: 'Email', onPress: () => Communications.email([member.email], null, null, 'Scavenger Hunt', 'Hello, Mate!!') },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Members of {team.name}</Text>
            <FlatList
                data={team.members}
                keyExtractor={(item) => item._id}
                renderItem={renderMember}
                contentContainerStyle={styles.list}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter member name"
                    value={member}
                    onChangeText={setMembers}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <Button title="Add Member" onPress={handleAddMember} />
                <View style={[styles.button]}>
                    <Button
                        title="Delete Team"
                        color="red"
                        onPress={handleDeleteTeam}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 16,
        textAlign: 'center',
        color: '#333',
    },
    list: {
        paddingHorizontal: 16,
    },
    inputContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginVertical: 4,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    memberContact: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
});
