import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import apiClient from '../../components/apiClient/api';


export default function Leaderboard() {
  const [teams, setTeams] = useState([]);

    // Fetch leaderboard data
    useEffect(() => {
      const fetchLeaderBoard = async () => {
        try {
          const response = await apiClient.get('/teams/leaderboard');
          if (response.status === 200) {
            setTeams(response.data.teams); // Set the leaderboard data
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        }
      };
  
      fetchLeaderBoard();
    }, []);

    const renderTeamItem = ({ item, index }) => (
      <View style={styles.teamItem}>
        <Text style={styles.rank}>{index + 1}.</Text>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.score}>{item.score}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={renderTeamItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rank: { fontSize: 18, fontWeight: 'bold' },
  teamName: { fontSize: 18 },
  score: { fontSize: 18, fontWeight: 'bold', color: 'green' },
});
