import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Animated,
} from 'react-native';
import { globalStyles } from '../styles';
import { Swipeable } from 'react-native-gesture-handler';
import SwipeableItem from './SwipeableItem';

export default class TodoList extends React.Component {
  state = {
    // Mount these to something
    addingTodo: false,
    editingIndex: null,
    todoText: '',
  };

  // Adds a checklist item
  AddTodo = () => {
    this.setState({ addingTodo: true }, () => {
      this.props.textFocus.current.focus();
    });

    Keyboard.dismiss();
  };

  // Create a new checklist item
  createTodo = async () => {
    let list = this.props.list;
    list.todos.push({ title: this.state.todoText, completed: false });

    this.props.updateList(list);
    await this.props.saveList(list);

    // Update todos array, return text to default, and disable addingTodo
    this.setState({ todoText: '', addingTodo: false });
  };

  // Toggles whether or not a checklist item is completed or not
  toggleChecklistCompleted = async (index) => {
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
    await this.props.saveList(list);
  };

  // Toggles the whole checklist category completed or not
  toggleCategoryCompleted = async () => {
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
    await this.props.saveList(list);
  };

  // Allows you to open/close category lists
  toggleListOpened = async () => {
    let list = { ...this.props.list };
    list.opened = !list.opened;

    this.props.updateList(list);
    await this.props.saveList(list);
  };

  renderTextInput = ({ onSubmitEditing, index }) => {
    const list = this.props.list;
    return (
      <View style={[styles.container, { backgroundColor: `${list.color}40` }]}>
        <Feather name="square" style={globalStyles.icon} />
        <TextInput
          ref={this.props.textFocus}
          style={styles.itemText}
          placeholder="Item name..."
          placeholderTextColor="black"
          value={this.state.todoText}
          maxLength={32}
          onChangeText={(text) => this.setState({ todoText: text })}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    );
  };

  startEditing = (index, todo) => {
    this.setState({ editingIndex: index, todoText: todo.title });
  };

  saveEditedTodo = async () => {
    let list = this.props.list;
    const { editingIndex, todoText } = this.state;
    list.todos[editingIndex].title = todoText;

    this.setState({ editingIndex: null, todoText: '' });

    this.props.updateList(list);
    await this.props.saveList(list);
  };

  deleteTodo = async (index) => {
  console.log("Deleting checklist item: " + index);
  let list = { ...this.props.list }; // Create a copy of the list object

    // Delete checklist item
    list.todos.splice(index, 1);

  // Update state and persist changes
  this.props.updateList(list);
  await this.props.saveList(list);
};

deleteCategory = async () => {
    console.log("Deleting category: " + this.props.list.name);
    console.log("This has not been added yet");
  };

  renderTodo = (todo, index) => {
    const list = this.props.list;
    const { editingIndex } = this.state;
    return (
      <View>
        {editingIndex === index ? (
          this.renderTextInput({ onSubmitEditing: this.saveEditedTodo, index: index })
        ) : (
          <Swipeable
            renderRightActions={(_, dragX) => (
              <SwipeableItem
                onEdit={() => this.startEditing(index, todo)}
                onDelete={() => this.deleteTodo(index)}
              />
            )}
          >
            <TouchableOpacity
              style={[styles.container, { backgroundColor: `${list.color}40` }]}
              onPress={() => this.toggleChecklistCompleted(index)}>
              <TouchableOpacity
                onPress={() => this.toggleChecklistCompleted(index)}>
                <Feather
                  name={todo.completed ? 'check-square' : 'square'}
                  style={globalStyles.icon}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.itemText,
                  {
                    textDecorationLine: todo.completed
                      ? 'line-through'
                      : 'none',
                  },
                  { opacity: todo.completed ? 0.5 : 1 },
                ]}
                numberOfLines={1}>
                {todo.title}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      </View>
    );
  };

  render() {
    const list = this.props.list;
    return (
      <View>
        
        {/* Category Swipeable */}
          <Swipeable
        renderRightActions={(_, dragX) => (
          <SwipeableItem
            onEdit={() => this.startEditing(index, list)}
            onDelete={() => this.deleteCategory()}
            isCategory={true}
          />
        )}
      >
          
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
        
          </Swipeable>
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
                this.renderTextInput({ onSubmitEditing: this.createTodo })
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
    height: 46,
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
  gestures: {
    flexDirection: 'row',
  },
  swipeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 1,
  },
});
