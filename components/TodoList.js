import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default TodoList = ({ list }) => {
  return (
    <View style={[styles.container, { backgroundColor: list.color }]}>
      <View>
        {list.completed ? (
          <Feather name="check-square" style={styles.icon} />
        ) : (
          <Feather name="square" style={styles.icon} />
        )}
      </View>
      <Text style={styles.categoryText} numberOfLines={1}>
        {list.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 10,
    borderRadius: 10,
  },
  categoryText: {
    paddingLeft: 8,
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 4,
  },
  icon: {
    fontSize: 26,
    color: 'black',
    paddingLeft: 8,
    opacity: 1,
  }
});
