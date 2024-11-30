export default function EditTaskScreen({ route, navigation }) {
    
    const { poi } = route.params;
  
    const [name, setName] = useState(poi.name);
    const [address, setAddress] = useState(poi.address);
    const [task, setTask] = useState(poi.task);
    const [tags, setTags] = useState(poi.tags.join(', '));
  
    const handleSavePOI = () => {
      const updatedPOI = {
        ...poi,
        name,
        address,
        task,
        tags: tags.split(',').map(tag => tag.trim()),
      };
  
      console.log('POI Updated:', updatedPOI);
      navigation.goBack(); // Return to the previous screen
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter POI Name" />
  
        <Text style={styles.label}>Address:</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter Address" />
  
        <Text style={styles.label}>Task Instructions:</Text>
        <TextInput style={styles.input} value={task} onChangeText={setTask} placeholder="Enter Task Instructions" />
  
        <Text style={styles.label}>Tags (comma-separated):</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="e.g., Outdoor, Easy" />
  
        <Button title="Save POI" onPress={handleSavePOI} />
      </View>
    );
  }
  