import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const mockLeaderboard = [
  { id: '1', name: 'John Doe', points: 120 },
  { id: '2', name: 'Jane Smith', points: 110 },
  { id: '3', name: 'Alice Johnson', points: 95 },
  { id: '4', name: 'Bob Brown', points: 85 },
];

export default function Leaderboard() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.points}>{item.points} Points</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={mockLeaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  points: { fontSize: 16, color: '#555' },
});
