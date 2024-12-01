import React, { useContext } from 'react';
import { View, FlatList, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import data from '../../components/data/data';
import { POIContext } from '../../components/SharedContext/TaskContext';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function HomeScreen({ navigation }) {
    // const { poi } = route.params;

    const { pois } = useContext(POIContext); // Access the shared POI list
    
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

  // console.log('Navigation State:', navigation.getState());

  return (
    <View style={styles.container}>

        <Button
        title="Add POI"
        onPress={() => navigation.navigate('AddTask')}        /> 
      <FlatList
        data={pois}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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


});
