import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';

import React from 'react';
import { Feather } from '@expo/vector-icons';
import tempData from './tempData';
import TodoList from './components/TodoList';
import { LinearGradient } from 'expo-linear-gradient';
import SettingsModal from './components/SettingsMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tinycolor from 'tinycolor2';

const DEFAULT_BACKGROUND_COLOR = '#4158D0';

export default class App extends React.Component {
  state = {
    settingsVisible: false,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  };

  // Toggles the settings modal
  toggleSettingsModal() {
    this.setState({ settingsVisible: !this.state.settingsVisible });
  }

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

  // Runs the first time the application starts
  async componentDidMount() {
    // Searches for background color in AsyncStorage
    try {
      const color = await AsyncStorage.getItem('backgroundColor');
      if (color !== null) {
        this.setState({ backgroundColor: color });
      }
    } catch (error) {
      console.log('Error retrieving saved color:', error);
    }
  }

  adjustBrightness(hex, factor) {
    // Gets the color based off the hex value using tinycolor2 library
    const color = tinycolor(hex);
    // Brighten/darken the given color using tinycolor2
    const newColor = color.brighten(factor);
    // Converts back to a hex value
    return newColor.toHexString();
  }

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
            />
          </Modal>

          {/* Header (Contains menu & checklist title) */}
          <View style={styles.header}>
            <Text style={styles.title}>Checklist</Text>
            <TouchableOpacity onPress={() => this.toggleSettingsModal()}>
              <Feather name="menu" size={64} color="white" />
            </TouchableOpacity>
          </View>

          {/* Task container */}
          <View style={styles.tasks}>
            <FlatList
              data={tempData}
              keyExtractor={(item) => item.name}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <TodoList list={item} />}
            />
          </View>
        </View>

        {/* Add Category button (Hovers above everything) */}
        <TouchableOpacity style={styles.addItem}>
          <Feather name="plus" size={22} color="black" />
          <Text style={styles.addItemText}>Add Category</Text>
        </TouchableOpacity>

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
  addItem: {
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
  addItemText: {
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  grad: {
    ...StyleSheet.absoluteFillObject, // Position the gradient to cover the entire screen
  },
});
