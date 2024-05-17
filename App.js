import { Text, SafeAreaView, StyleSheet, View } from 'react-native';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import ChecklistCat from './components/ChecklistCat';
import { Feather } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Feather name="menu" size={48} color="white" />
        <Text style={styles.title}>Checklist</Text>
      </View>
      <View style={styles.tasks}>
        <ChecklistCat />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#3452AE',
    padding: 8,
    verticalAlign: 'top',
  },
  tasks: {
    paddingHorizontal: 20,
  },
  title: {
    margin: 24,
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffff',
    paddingBottom: 5,
  },
});
