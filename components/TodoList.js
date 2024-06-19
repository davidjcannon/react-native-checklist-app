import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard
} from 'react-native';
import { globalStyles } from '../styles';

export default class TodoList extends React.Component {
  state = {
    // Mount these to something
    addingTodo: false,
    newTodoText: '',
  };

  // Adds a checklist item
  AddTodo = () => {
    this.setState({ addingTodo: true }, () => {
      this.props.textFocus.current.focus(); // Accessing the ref from props
    });

    Keyboard.dismiss();
  };

  // Create a new checklist item
  createTodo = () => {
    let list = this.props.list;
    list.todos.push({ title: this.state.newTodoText, completed: false });

    this.props.updateList(list);

    // Update todos array, return text to default, and disable addingTodo
    this.setState({
      newTodoText: '',
      addingTodo: false,
    });
  };

  // Toggles whether or not a checklist item is completed or not
  toggleChecklistCompleted = (index) => {
    let list = this.props.list;
    list.todos[index].completed = !list.todos[index].completed;

    // When making a checklist item off, check if all others are true, if so check category
    if (this.props.list.todos.every((task) => task.completed)) {
      this.props.list.completed = true;
    }

    // If you make a checklist item false, make checklist category false too
    if (list.todos[index].completed == false) {
      this.props.list.completed = false;
    }

    // Save changes to the list
    this.props.updateList(list);
  };

  // Toggles the whole checklist category completed or not
  toggleCategoryCompleted = () => {
    const updatedList = {
      // Toggles the category button specifically
      ...this.props.list,
      completed: !this.props.list.completed,
      // Goes into the categories todos and sets them all to the same condition as the category button
      todos: this.props.list.todos.map((task) => ({
        ...task,
        completed: !this.props.list.completed,
      })),
    };

    this.props.updateList(updatedList);
  };

  // Allows you to open/close category lists
  toggleListOpened = () => {
    let list = { ...this.props.list };
    list.opened = !list.opened;

    this.props.updateList(list);
  };

  renderTodo = (todo, index) => {
    const list = this.props.list;
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: `${list.color}40` }]}>
        <TouchableOpacity onPress={() => this.toggleChecklistCompleted(index)}>
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

  render() {
    const list = this.props.list;
    return (
      <View>
        {/* Open/Close Category Button */}
        <TouchableOpacity
          style={[styles.container, { backgroundColor: list.color }]}
          onPress={this.toggleListOpened}>
          {/* Check/Uncheck Button */}
          <TouchableOpacity onPress={this.toggleCategoryCompleted}>
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
          {/* Only shows tasks if the current list is open */}
          {list.opened && (
            <>
              {/* Todo List Items */}
              <FlatList
                data={list.todos}
                renderItem={({ item, index }) => this.renderTodo(item, index)}
                keyExtractor={(item) => item.title}
              />
              {this.state.addingTodo ? (
                <View
                  style={[
                    styles.container,
                    { backgroundColor: `${list.color}40` },
                  ]}>
                  <Feather name="square" style={globalStyles.icon} />
                  <TextInput
                    ref={this.props.textFocus}
                    style={styles.itemText}
                    placeholder="Item name..."
                    placeholderTextColor="black"
                    value={this.state.newTodoText}
                    maxLength={32}
                    onChangeText={(text) =>
                      this.setState({ newTodoText: text })
                    }
                    onSubmitEditing={this.createTodo}
                  />
                </View>
              ) : (
                // Add Button
                <TouchableOpacity
                  style={[
                    styles.addItem,
                    { backgroundColor: `${list.color}20` },
                  ]}
                  onPress={this.AddTodo}>
                  <Feather name="plus" size={22} color="black" />
                  <Text style={styles.addItemText}>Add Checklist Item</Text>
                </TouchableOpacity>
              )}
            </>
          )}
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
    width: '85%',
    outlineStyle: 'none',
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
  },
});
