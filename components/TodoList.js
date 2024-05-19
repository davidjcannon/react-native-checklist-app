import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default TodoList = ({ list }) => {
  return (
    <View style ={[styles.container, {backgroundColor: list.color }]}>
      <Text style = {styles.category} numberOfLines={1}>
      {list.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    height: 40,
    marginBottom: 10,
  },
  category: {
    paddingLeft: 12,
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  }
});
