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

    // When adding a new item, uncheck category box
    this.props.list.completed = false;

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

  renderItemInput = ({ onSubmitEditing }) => {
    const list = this.props.list;
    return (
      <View
        style={[
          globalStyles.todoContainer,
          { backgroundColor: `${list.color}40` },
        ]}>
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
    console.log(this.state.editingIndex);
    this.setState({ editingIndex: index, todoText: todo.title });
    console.log(
      'Editing Index: ' + this.state.editingIndex + ' / Index: ' + index
    );
    console.log('Todo Text: ' + todo.title);
    console.log('Todo: ' + todo);
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
    console.log('Deleting checklist item: ' + index);
    let list = { ...this.props.list }; // Create a copy of the list object

    // Delete checklist item
    list.todos.splice(index, 1);

    // Update state and persist changes
    this.props.updateList(list);
    await this.props.saveList(list);
  };

  deleteCategory = async () => {
    console.log('Attempting to delete category');
    const { list, lists } = this.props;
    console.log('Current list:', lists);
    console.log('Deleting category with id:', list.id);

    // Filter out the category with the given id from the lists array
    let updatedLists = lists.filter((item) => item.id !== list.id);
    console.log('Updated lists:', updatedLists);

    // Re-index categories
    updatedLists = updatedLists.map((item, idx) => ({
      ...item,
      id: idx + 1, // Re-index starting from 1
    }));

    // Save the updated lists to AsyncStorage
    await this.props.saveList(updatedLists);
    this.props.loadData();

    console.log('Category deleted');
  };

  renderTodo = (todo, index) => {
    const list = this.props.list;
    const { editingIndex } = this.state;
    return (
      <View>
        {editingIndex === index ? (
          this.renderItemInput({ onSubmitEditing: this.saveEditedTodo })
        ) : (
          <Swipeable
            renderRightActions={(_, dragX) => (
              <SwipeableItem
                onEdit={() => this.startEditing(index, todo)}
                onDelete={() => this.deleteTodo(index)}
              />
            )}>
            <TouchableOpacity
              style={[
                globalStyles.todoContainer,
                { backgroundColor: `${list.color}40` },
              ]}
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
    const { list, renderCategory, addingCategoryId } = this.props;
    return (
      <View>
        {addingCategoryId === list.id ? (
          renderCategory(list, true)
        ) : (
          // Category Swipeable
          <Swipeable
            renderRightActions={(_, dragX) => (
              <SwipeableItem
                onEdit={() => this.props.startCategoryEditing(list.id)}
                onDelete={() => this.deleteCategory()}
                isCategory={true}
              />
            )}>
            {renderCategory(list)}
          </Swipeable>
        )}
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
                this.renderItemInput({ onSubmitEditing: this.createTodo })
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
