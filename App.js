import { Text, SafeAreaView, StyleSheet, View, FlatList } from 'react-native';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import { Feather } from '@expo/vector-icons';
import tempData from './tempData';
import TodoList from './components/TodoList';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.content}>
        <View style={styles.header}>
          <Feather name="menu" size={48} color="white" />
          <Text style={styles.title}>Checklist</Text>
        </View>
        <View style={styles.tasks}>
          <FlatList
            data={tempData}
            keyExtractor={(item) => item.name}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <TodoList list={item} />}
          />
        </View>
        </View>
        <LinearGradient
        colors={['#4158D0', '#46578C', '#081F65']}
        style={styles.grad}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1, // Ensure content appears above the gradient
  },
  container: {
    flex: 1,
    padding: 8,
    verticalAlign: 'top',
  },
  tasks: {
    paddingHorizontal: 20,
    height: '100%',
  },
  title: {
    margin: 24,
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffff',
    paddingBottom: 5,
  },
  grad: {
    ...StyleSheet.absoluteFillObject, // Position the gradient to cover the entire screen
  },
});
