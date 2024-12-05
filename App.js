import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomePage/HomeScreen';
import AddTaskScreen from './components/Operations/AddTaskScreen'; 
import { POIProvider } from './components/SharedContext/TaskContext';
import DetailScreen from './screens/DetailScreen';
import EditTaskScreen from './components/Operations/EditTaskScreen';
import Maps from './screens/Maps/Maps';
import POITracker from './components/Navigation/POITracker';
import ContactScreen from './screens/Contacts/ContactScreen';
import Leaderboard from './screens/HomePage/LeaderBoard';
import TeamScreen from './screens/Teams/TeamScreen';
import { TeamProvider } from './components/SharedContext/TeamContext';
import AddMember from './screens/Teams/Members/TeamMemberScreen';
import SelectTeam from './screens/Teams/SelectTeam'


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

      <TeamProvider>

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

            <Stack.Screen name="Maps" component={Maps} />

            <Stack.Screen name='POITracker' component={POITracker}/>

            <Stack.Screen name='Contact' component={ContactScreen} />

            <Stack.Screen name='LeaderBoard' component={Leaderboard} />

            <Stack.Screen name = 'Team' component={TeamScreen} />

            <Stack.Screen name = 'AddMember' component={AddMember} />

            <Stack.Screen name = 'SelectTeam' component={SelectTeam} />
        
          </Stack.Navigator>

        </NavigationContainer>
      </TeamProvider>


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
