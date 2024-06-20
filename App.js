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
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    lists: tempData,
    addingCategory: false,
    newCategoryText: '',
  };

  // Toggles the settings modal
  toggleSettingsModal() {
    this.setState({ settingsVisible: !this.state.settingsVisible });
    if (this.state.settingsVisible == true) {
      console.log('Closing modal and loading data');
      this.loadData();
    }
  }

  // Runs the first time the application starts
  async componentDidMount() {
    this.loadData();
  }

  // Checks if the previous state is the same as the current state, if so throw an error
  async componentDidUpdate(_, prevState) {
    if (prevState.lists !== this.state.lists) {
      try {
        await AsyncStorage.setItem('lists', JSON.stringify(this.state.lists));
      } catch (error) {
        console.log('Error saving lists:', error);
      }
    }
  }

  // Makes the adding category text box appear when "Add Category" is clicked
  AddCategory = () => {
    this.setState({ addingCategory: true }, () => {
      this.textFocus.current.focus(); // Focus the TextInput
    });
  };

  // Create a new checklist item
  createCategory = () => {
    const { newCategoryText } = this.state;
    const color = '#FFFFFF';

    const list = { name: newCategoryText, color: '#FFFFFF', opened: true };

    this.addList(list);

    // Makes add category box disappear and returns text to default
    this.setState({ newCategoryText: '', addingCategory: false });
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

  renderList = (list) => {
    return (
      <TodoList
        textFocus={this.textFocus}
        list={list}
        updateList={this.updateList}
        saveList={this.saveList}
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
      if (lists !== '[]' && lists !== null) {
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
      await AsyncStorage.setItem('lists', JSON.stringify(lists));
    } catch (error) {
      console.log('Error saving lists:', error);
    }
  };

  render() {
    const { backgroundColor } = this.state;

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
          {this.state.addingCategory && (
            <View style={styles.categoryInput}>
              <Feather name="square" style={globalStyles.icon} />
              <TextInput
                // Allows the text input to auto focus
                ref={this.textFocus}
                style={globalStyles.categoryText}
                placeholder="Category name..."
                placeholderTextColor="black"
                value={this.state.newCategoryText}
                maxLength={20}
                onChangeText={(text) =>
                  this.setState({ newCategoryText: text })
                }
                onSubmitEditing={this.createCategory}
              />
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
        {!this.state.addingCategory && (
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
    height: 38,
    marginBottom: 24,
  },
  categoryInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    marginBottom: 5,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  grad: {
    ...StyleSheet.absoluteFillObject, // Position the gradient to cover the entire screen
  },
});
