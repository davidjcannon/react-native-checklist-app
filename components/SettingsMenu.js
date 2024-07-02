import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const debug = false;

export default class SettingsModal extends React.Component {
  // Color selection array for choosing your background color
  colorSelection = [
    '#24A6D9', // Green
    '#6078EA', // Water
    '#4158D0', // Default Dark Blue
    '#632599', // Purple
    '#7F1DD0', // Custom
    '#D85963', // Light Red
    '#99290B', // Red
  ];

  // Save background color in AsyncStorage
  saveBackground = async () => {
    // Defines color based on current state of the color pressed
    const { color } = this.state;
    try {
      // If debug is on, tries to find the background color from AsyncStorage so that it can be logged
      if (debug == true) {
        const savedColor = await AsyncStorage.getItem('backgroundColor');
        console.log('Color was ', savedColor);
      }
      // Save background color in AsyncStorage
      await AsyncStorage.setItem('backgroundColor', color);
      console.log('Changed background color successfully: ', color);
    } catch (error) {
      console.log('Error saving background color: ', error);
    }
  };

  // Clear AsyncStorage data
  resetData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Successfully cleared all data');
    } catch (error) {
      console.log('Error clearing data: ', error);
    }
    // Update background color back to default after clearing
    this.props.updateBackgroundColor(null);
  };

  // Render color buttons based of color selection
  renderColors() {
    // Iterates over array of colors and makes them a TouchableOpacity button
    return this.colorSelection.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.colorButton, { backgroundColor: color }]}
          onPress={() => {
            this.setState({ color }, () => {
              this.props.updateBackgroundColor(color); // Update the background color in App.js
              this.saveBackground(); // Save the selected color after state has been updated
              this.props.closeModal(); // Close modal and return to main page
            });
          }}
        />
      );
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container} behavior="padding">
        {/* Header (Contains title & x button) */}
        <View style={styles.header}>
          <Text style={styles.header}>Settings</Text>
          <TouchableOpacity
            style={styles.close}
            onPress={this.props.closeModal}>
            <Feather name="x" size={48} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {/* Color Selection */}
          <Text style={styles.setting}>Background Color</Text>
          <View style={styles.backgroundSelect} onPress={this.saveBackground}>
            {this.renderColors()}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              this.resetData();
              this.props.closeModal();
            }}>
            <Text style={{ color: 'white' }}>Clear all data</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292E3F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  close: {
    position: 'absolute',
    right: 24,
    top: 8,
  },
  setting: {
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButton: {
    // Fix the settings menu
    height: 40,
    width: 40,
    borderRadius: 4,
    marginRight: 4,
  },
  backgroundSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  resetButton: {
    width: '60%',
    maxWidth: 400,
    height: 50,
    marginTop: 24,
    backgroundColor: '#D85963',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
