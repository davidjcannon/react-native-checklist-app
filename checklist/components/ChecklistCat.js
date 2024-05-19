import { Text, View, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChecklistCat() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="black"/>
      <Text style={styles.category}>
        Tutorial
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 40,
  },
  category: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  }
});
