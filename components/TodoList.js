import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { globalStyles } from '../styles';

export default class TodoList extends React.Component {
  state = {
    name: this.props.list.name,
    color: this.props.list.color,
    todos: this.props.list.todos,
    // Mount these to something
    addingTodo: false,
    newTodoText: '',
  };

// Adds a checklist item
    AddTodo = () => {
    this.setState({ addingTodo: true });
  };

  renderTodo = (todo) => {
    const list = this.props.list;
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: `${list.color}40` }]}>
        <TouchableOpacity>
          <Feather
            name={todo.completed ? 'check-square' : 'square'}
            style={globalStyles.icon}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.itemText,
            { textDecorationLine: todo.completed ? 'line-through' : 'none' },
            { opacity: todo.completed ? 0.5 : 1 },
          ]}
          numberOfLines={1}>
          {todo.title}
        </Text>
      </TouchableOpacity>
    );
  };

  // Create a new checklist item
  createTodo = () => {
    const { name, color } = this.state;

    tempData.push({
      name,
      color,
      todos: []
    })

    this.setState({ name: '' });
  };

  render() {
    const list = this.props.list;
    return (
      <View>
        {/* Open/Close Category Button */}
        <TouchableOpacity
          style={[styles.container, { backgroundColor: list.color }]}>
          {/* Check/Uncheck Button */}
          <TouchableOpacity>
            <Feather
              name={list.completed ? 'check-square' : 'square'}
              style={globalStyles.icon}
            />
          </TouchableOpacity>
          <Text style={globalStyles.categoryText} numberOfLines={1}>
            {list.name}
          </Text>
        </TouchableOpacity>
        <View>
          {/* Todo List Items */}
          <FlatList
            data={this.state.todos}
            renderItem={({ item }) => this.renderTodo(item)}
            keyExtractor={(item) => item.title}
          />
          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addItem, { backgroundColor: `${list.color}20` }]}>
            <Feather name="plus" size={22} color="black" />
            <Text style={styles.addItemText}>Add Checklist Item</Text>
          </TouchableOpacity>
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
    marginBottom: 5,
    borderRadius: 10,
  },
  itemText: {
    paddingLeft: 6,
    fontSize: 16,
    paddingBottom: 4,
  },
  addItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  addItemText: {
    opacity: 0.8,
    fontWeight: '600',
    paddingBottom: 2,
    paddingLeft: 2,
  }
});