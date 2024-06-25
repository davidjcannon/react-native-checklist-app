import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';

import React from 'react';
import { Feather } from '@expo/vector-icons';
import tempData from './tempData';
import TodoList from './components/TodoList';
import { LinearGradient } from 'expo-linear-gradient';
import SettingsModal from './components/SettingsMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tinycolor from 'tinycolor2';
import { globalStyles } from './styles';

const DEFAULT_BACKGROUND_COLOR = '#4158D0';

export default class App extends React.Component {
  textFocus = React.createRef();

  state = {
    settingsVisible: false,
    addingCategory: false,
    addingCategoryId: null,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    lists: tempData,
    categoryText: '',
  };

  // Toggles the settings modal
  toggleSettingsModal = async () => {
    this.setState({ settingsVisible: !this.state.settingsVisible });
    if (this.state.settingsVisible == true) {
      console.log('Closing modal and loading data');
      await this.loadData();
    }
  }

  // Runs the first time the application starts
  async componentDidMount() {
    this.loadData();
  }

  // Checks if the previous state is the same as the current state, if so throw an error
  async componentDidUpdate(_, prevState) {
    if (prevState.lists !== this.state.lists) {
      saveList(this.state.lists);
    }
  }

  // Makes the adding category text box appear when "Add Category" is clicked
  AddCategory = () => {
    this.setState({ addingCategory: true, categoryText: '' }, () => {
      this.textFocus.current.focus();
    });
  };

  // Create a new checklist item
  createCategory = () => {
    const { categoryText, addingCategory, addingCategoryId, lists } = this.state;

    // Define updatedLists based on whether adding a new category or editing an existing one
    const updatedLists = addingCategory
      ? [
          // Adding a new category
          {
            id: lists.length + 1,
            name: categoryText,
            color: '#FFFFFF',
            opened: true,
            todos: [],
          },
          ...lists,
        ]
      : lists.map((list) =>
          // Editing an existing category
          list.id === addingCategoryId ? { ...list, name: categoryText } : list
        );

    // Update the state with new lists and reset category-related states
    this.setState({
      lists: updatedLists,
      addingCategory: false,
      addingCategoryId: null,
      categoryText: '',
    });
  };

  startCategoryEditing = (id) => {
    const list = this.state.lists.find((list) => list.id === id);
    this.setState(
      { addingCategoryId: id, categoryText: list.name, addingCategory: false },
      () => {
        this.textFocus.current.focus(); // Focus the TextInput
      }
    );
  };

  saveEditedCategory = async () => {
    const { addingCategoryId, categoryText, lists } = this.state;
    const updatedLists = lists.map((list) => {
      if (list.id === addingCategoryId) {
        return { ...list, name: categoryText }; // Update the name, keep other properties
      }
      return list;
    });

    this.setState({
      lists: updatedLists,
      addingCategoryId: null,
      categoryText: '',
    });

    saveList(updatedLists);
  };

  // Toggles the whole checklist category completed or not
  toggleCategoryCompleted = async (listId) => {
    const updatedLists = this.state.lists.map((list) => {
      if (list.id === listId) {
        const completed = !list.completed;
        return {
          ...list,
          completed,
          todos: list.todos.map((task) => ({ ...task, completed })),
        };
      }
      return list;
    });

    this.setState({ lists: updatedLists }, () => this.saveList(updatedLists));
  };

  // Allows you to open/close category lists
  toggleListOpened = async (id) => {
    const updatedLists = this.state.lists.map((list) =>
      list.id === id ? { ...list, opened: !list.opened } : list
    );
    this.setState({ lists: updatedLists }, () => this.saveList(updatedLists));
  };

  // Updates background color to the given color
  updateBackgroundColor = (color) => {
    // If the color is null, use the default background color
    // Mostly here for when you reset your data
    if (color != null) {
      this.setState({ backgroundColor: color });
    } else {
      this.setState({ backgroundColor: DEFAULT_BACKGROUND_COLOR });
    }
  };

  adjustBrightness(hex, factor) {
    // Gets the color based off the hex value using tinycolor2 library
    const color = tinycolor(hex);
    // Brighten/darken the given color using tinycolor2
    const newColor = color.brighten(factor);
    // Converts back to a hex value
    return newColor.toHexString();
  }

  changeCategoryText = (text) => {
    setCategoryText(text);
  };

  renderList = (list) => {
    return (
      <TodoList
        textFocus={this.textFocus}
        list={list}
        lists={this.state.lists}
        updateList={this.updateList}
        saveList={this.saveList}
        loadData={this.loadData}
        addingCategoryId={this.state.addingCategoryId}
        startCategoryEditing={this.startCategoryEditing}
        renderCategory={this.renderCategory}
        categoryText={this.state.categoryText}
        changeCategoryText={this.changeCategoryText}
      />
    );
  };

  // Adds a new category
  addList = (list) => {
    this.setState({
      lists: [
        { ...list, id: this.state.lists.length + 1, todos: [] },
        ...this.state.lists,
      ],
    });
  };

  updateList = (list) => {
    this.setState({
      lists: this.state.lists.map((item) => {
        return item.id === list.id ? list : item;
      }),
    });
  };

  loadData = async () => {
    try {
      // Searches for background color
      const color = await AsyncStorage.getItem('backgroundColor');
      if (color !== null) {
        this.setState({ backgroundColor: color });
      }

      // Searches for previous list save data
      const lists = await AsyncStorage.getItem('lists');
      if (lists !== null) {
        console.log('Lists from AsyncStorage:', lists);
        this.setState({ lists: JSON.parse(lists) });
      } else {
        console.log('Lists not found');
        this.setState({ lists: tempData });
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
    }
  };

  saveList = async (list) => {
    try {
      await AsyncStorage.setItem('lists', JSON.stringify(list));
    } catch (error) {
      console.log('Error saving lists:', error);
    }
  };

  renderCategoryInput = () => {
    return <Text>Old code</Text>;
  };

  renderCategory = (list, isInput = false) => {
    let categoryColor, boxCheck;

    // Set values from list
    try {
      categoryColor = list.color;
      boxCheck = list.completed;
      // If it can't find list values set defaults
    } catch (error) {
      // Checks whether or not you're inputting a new category as to not create weird effect
      categoryColor = isInput ? '' : '#FFFFFF';
      boxCheck = false;
    }

    return (
      // Open/Close Category Button
      <TouchableOpacity
        style={[globalStyles.todoContainer, { backgroundColor: categoryColor }]}
        onPress={() => this.toggleListOpened(list.id)}>
        {/* Check/Uncheck Button */}
        <TouchableOpacity onPress={() => this.toggleCategoryCompleted(list.id)}>
          <Feather
            name={boxCheck ? 'check-square' : 'square'}
            style={globalStyles.icon}
          />
        </TouchableOpacity>
        {isInput === false ? (
          <Text style={globalStyles.categoryText} numberOfLines={1}>
            {list.name}
          </Text>
        ) : (
          <TextInput
            ref={this.textFocus}
            style={globalStyles.categoryText}
            placeholder="Category name..."
            placeholderTextColor="black"
            value={this.state.categoryText}
            maxLength={20}
            onChangeText={(text) => this.setState({ categoryText: text })}
            onSubmitEditing={this.createCategory}
          />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const { backgroundColor, addingCategory, addingCategoryId } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Settings Modal */}
          <Modal
            animationType="slide"
            visible={this.state.settingsVisible}
            onRequestClose={() => this.toggleSettingsModal}>
            <SettingsModal
              closeModal={() => this.toggleSettingsModal()}
              updateBackgroundColor={this.updateBackgroundColor}
              updateList={this.updateList}
              saveList={this.saveList}
            />
          </Modal>

          {/* Header (Contains menu & checklist title) */}
          <View style={styles.header}>
            <Text style={styles.title}>Checklist</Text>
            <TouchableOpacity onPress={() => this.toggleSettingsModal()}>
              <Feather name="menu" size={64} color="white" />
            </TouchableOpacity>
          </View>

          {/* Adding new category box */}
          {addingCategory && (
            <View style={styles.categoryInput}>
              {this.renderCategory(null, true)}
            </View>
          )}
          {/* Task container */}
          <View style={styles.tasks}>
            <FlatList
              data={this.state.lists}
              keyExtractor={(item) => item.name}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => this.renderList(item)}
              keyboardShouldPersistTaps="always"
              // Adds a margin below all of the categories, set this to 120 to perfectly fit
              ListFooterComponent={<View style={{ height: 360 }} />}
            />
          </View>
        </View>

        {/* Add Category button (Hovers above everything) */}
        {!addingCategory && addingCategoryId === null && (
          <TouchableOpacity
            style={styles.addCategory}
            onPress={this.AddCategory}>
            <Feather name="plus" size={22} color="black" />
            <Text style={styles.addCatText}>Add Category</Text>
          </TouchableOpacity>
        )}

        {/* Gradient Background #7F1DD0 */}
        {backgroundColor === '#7F1DD0' ? (
          <LinearGradient
            colors={['#C40809', '#2503FD', '#632599']}
            style={styles.grad}
          />
        ) : (
          <LinearGradient
            colors={[
              backgroundColor,
              this.adjustBrightness(backgroundColor, -5),
              this.adjustBrightness(backgroundColor, -30),
            ]}
            style={styles.grad}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // All content that needs to be placed on top of the gradient
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 8,
  },
  tasks: {
    paddingHorizontal: 16,
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
  addCategory: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    zIndex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    width: 160,
    height: 46,
    marginBottom: 24,
  },
  categoryInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 46,
    marginBottom: 5,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  grad: {
    ...StyleSheet.absoluteFillObject, // Position the gradient to cover the entire screen
  },
});
