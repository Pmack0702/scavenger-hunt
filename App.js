import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './components/Operations/AddTaskScreen'; 
import { POIProvider } from './components/SharedContext/TaskContext';
import DetailScreen from './screens/DetailScreen';
import EditTaskScreen from './components/Operations/EditTaskScreen';


const Stack = createStackNavigator(); // Create a Object which helps to navigate between screen

console.log('SplashScreen:', SplashScreen);

// useEffect(() => {
//   const unsubscribe = navigation.addListener('state', (e) => {
//     console.log('Navigation Action:', e);
//   });

//   return unsubscribe; // Clean up the listener
// }, [navigation]);


export default function App() {
  return (

    <POIProvider>

      <NavigationContainer>

        <Stack.Navigator initialRouteName="Splash" >

          <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
          /> 

          <Stack.Screen name='HomeScreen' component={HomeScreen} /> 

          <Stack.Screen name="AddTask" component={AddTaskScreen} /> 
          <Stack.Screen name="EditTask" component={EditTaskScreen} /> 


          <Stack.Screen name="Detail" component={DetailScreen} />
      
        </Stack.Navigator>

      </NavigationContainer>

    </POIProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
