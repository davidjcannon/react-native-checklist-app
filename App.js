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

export default class App extends React.Component {
  state = {
    settingsVisible: false,
    backgroundColor: '#4158D0',
  };

  toggleSettingsModal() {
    this.setState({ settingsVisible: !this.state.settingsVisible });
  }

  updateBackgroundColor = (color) => {
    this.setState({ backgroundColor: color });
  };

  async componentDidMount() {
    try {
      const savedColor = await AsyncStorage.getItem('backgroundColor');
      if (savedColor !== null) {
        this.setState({ backgroundColor: savedColor });
      }
    } catch (error) {
      console.log('Error retrieving saved color:', error);
    }
  }

  adjustBrightness(hex, factor) {
    // Gets the color based off the hex value
    const color = tinycolor(hex);
    // Brighten/darken the given color using tinycolor2
    const newColor = color.brighten(factor);
    // Converts back to a hex value
    return newColor.toHexString();
  }

  render() {
    const { backgroundColor } = this.state;
    const color2 = this.adjustBrightness(backgroundColor, -5);
    const color3 = this.adjustBrightness(backgroundColor, -30);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Modal
            animationType="slide"
            visible={this.state.settingsVisible}
            onRequestClose={() => this.toggleSettingsModal}>
            <SettingsModal
              closeModal={() => this.toggleSettingsModal()}
              updateBackgroundColor={this.updateBackgroundColor}
            />
          </Modal>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.toggleSettingsModal()}>
              <Feather name="menu" size={40} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Checklist</Text>
          </View>

          <View style={styles.tasks}>
            <FlatList
              data={tempData}
              keyExtractor={(item) => item.name}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <TodoList list={item} />}
            />
          </View>
        </View>
        <View style={styles.addItem}>
          <Feather name="plus" size={22} color="black" />
          <Text style={styles.addItemText}>Add Item</Text>
        </View>

        <LinearGradient
          colors={[backgroundColor, color2, color3]}
          style={styles.grad}
        />
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
    // All content, needed for gradient
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 8,
    verticalAlign: 'top',
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
    width: '140px',
    height: '38px',
    marginBottom: '24px',
  },
  addItemText: {
    fontWeight: 'bold',
    paddingLeft: '10px',
  },
  grad: {
    ...StyleSheet.absoluteFillObject, // Position the gradient to cover the entire screen
  },
});
