import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const teamMembers = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Developer',
    email: 'meetpatel7026@gmail.com',
    phone: '+1234567890',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Designer',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
  },
  {
    id: '3',
    name: 'Bob Brown',
    role: 'Project Manager',
    email: 'bob.brown@example.com',
    phone: '+1122334455',
  },
];

const ContactScreen = ({ route }) => {

    const { poi } = route.params; // Retrieve the POI details from route.params

    const sendEmail = () => {
        const subject = `Details for ${poi.name} Task`;
        const body = `
          Here are the details for the task:
          - Name: ${poi.name}
          - Address: ${poi.address}
          - Task: ${poi.task}
          - Tags: ${poi.tags.join(', ')}
          - Latitude: ${poi.latitude}
          - Longitude: ${poi.longitude}
          - Rating: ${poi.rating}

          Do try this out a fun activity
        `;
    
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
        Linking.openURL(emailUrl).catch((err) => {
          Alert.alert('Error', 'Unable to send email. Please check your email configuration.');
          console.error('Email error:', err);
        });
      };

  const sendSMS = (phone) => {
    const sms = `sms:${phone}`;
    Linking.openURL(sms).catch((err) =>
      console.error('Error sending SMS:', err)
    );
  };

  const makeCall = (phone) => {
    const tel = `tel:${phone}`;
    Linking.openURL(tel).catch((err) =>
      console.error('Error making call:', err)
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>{item.role}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => sendEmail(item.email)}>
          <Text style={styles.buttonText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => sendSMS(item.phone)}>
          <Text style={styles.buttonText}>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => makeCall(item.phone)}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContactScreen;
