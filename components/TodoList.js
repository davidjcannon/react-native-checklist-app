import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default class TodoList extends React.Component {
  state = {
    name: this.props.list.name,
    color: this.props.list.color,
    todos: this.props.list.todos,
  };

  renderTodo = (todo) => {
    const list = this.props.list
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: `${list.color}80` }]}>
        <TouchableOpacity>
            {list.completed ? (
              <Feather name="check-square" style={styles.icon} />
            ) : (
              <Feather name="square" style={styles.icon} />
            )}
          </TouchableOpacity>
        <Text style={styles.itemText} numberOfLines={1}>{todo.title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const list = this.props.list;
    return (
      <View>
        <TouchableOpacity
          style={[styles.container, { backgroundColor: list.color }]}>
          <TouchableOpacity>
            {list.completed ? (
              <Feather name="check-square" style={styles.icon} />
            ) : (
              <Feather name="square" style={styles.icon} />
            )}
          </TouchableOpacity>
          <Text style={styles.categoryText} numberOfLines={1}>
            {list.name}
          </Text>
        </TouchableOpacity>
        <View>
          <FlatList
            data={this.state.todos}
            renderItem={({ item }) => this.renderTodo(item)}
            keyExtractor={(item) => item.title}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 8,
    borderRadius: 10,
  },
  categoryText: {
    paddingLeft: 8,
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 4,
  },
  itemText: {
    paddingLeft: 8,
    fontSize: 24,
    paddingBottom: 4,
  },
  icon: {
    fontSize: 26,
    color: 'black',
    paddingLeft: 8,
    opacity: 1,
  },
});
