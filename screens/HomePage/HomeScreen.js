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


    // UseEffect Hook to fetch all the POIS from the Database
    // useEffect(() => {

    //   const fetchPOIs = async () => {
        
    //     try {

    //       // Axios is used here to maek a HTTP request which return a promise
    //       const response = await apiClient.get('/pois');
    //       console.log(response.data)
    //       setpoislist(response.data) // Update the state
          
    //     } catch (error) {
    //       console.log("error:", error)
          
    //     }
    //   }


    //   fetchPOIs()
    // }, [navigation])

    
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('LeaderBoard')}
            style={styles.iconContainer}
          >
            <Icon name="bell" size={24} color="#000" />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);
  


  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Detail', { poi: item })} // Pass setPOIs to Details Screen
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>
        {item.tags.join(', ')} | {item.rating}⭐
      </Text>
    </TouchableOpacity>
  );

  // Check if pois is correctly populated and log it
  // console.log("POIs Data:", pois);

  // console.log('Navigation State:', navigation.getState());

  return (
    <View style={styles.container}>

      <Button
          title="Add POI"
          onPress={() => navigation.navigate('AddTask')}        
      /> 
      <FlatList
        data={pois}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  item: { padding: 16, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  details: { color: 'gray', marginTop: 4 },
  iconContainer: { marginRight: 16 }, // Padding for the bell icon
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  card: { marginBottom: 16, padding: 16, borderWidth: 1, borderRadius: 8 },


});
