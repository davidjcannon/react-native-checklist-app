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

export default class SettingsModal extends React.Component {
  colorSelection = [
    '#5CD859',
    '#24A6D9',
    '#595BD9',
    '#802209',
    '#D159D8',
    '#D85963',
    '#D88559',
  ];

  state = {
    color: this.colorSelection[0],
  };

  /*saveBackground = () => {
    const { color } = this.state;

    backgroundColor.push({ color });

    this.props.closeModal();
  };*/

  async componentDidMount() {
    // Retrieve saved color from AsyncStorage when component mounts
    try {
      const savedColor = await AsyncStorage.getItem('backgroundColor');
      if (savedColor !== null) {
        this.setState({ color: savedColor });
      }
    } catch (error) {
      console.log('Error retrieving saved color:', error);
    }
  }

  saveBackground = async () => {
    const { color } = this.state;
    try {
      const savedColor = await AsyncStorage.getItem('backgroundColor');
      console.log('Color was ', savedColor);
      await AsyncStorage.setItem('backgroundColor', color);
      console.log('Changed background color successfully: ', color);
    } catch (error) {
      console.log('Error saving background color:', error);
    }
  };

  resetData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Successfully cleared all data');
    } catch (error) {
      console.log('Error clearing data background color:', error);
    }
  };

  renderColors() {
    return this.colorSelection.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.colorButton, { backgroundColor: color }]}
          onPress={() => {
            this.setState({ color }); // Update state with the selected color
            this.props.updateBackgroundColor(color); // Update background color in App component
            this.saveBackground(); // Optionally save the selected color
          }}
        />
      );
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container} behavior="padding">
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.close}
            onPress={this.props.closeModal}>
            <Feather name="x" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.header}>Settings</Text>
          <Text style={styles.setting}>Background Color</Text>

          <View style={styles.backgroundSelect} onPress={this.saveBackground}>
            {this.renderColors()}
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={this.resetData}>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '20px',
  },
  close: {
    paddingRight: 8,
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
    height: 30,
    width: 30,
    borderRadius: 4,
  },
  backgroundSelect: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  resetButton: {
    width: '80%',
    height: 40,
    marginTop: 12,
    backgroundColor: '#D85963',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
