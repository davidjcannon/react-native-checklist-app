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
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import tempData from './tempData';
import TodoList from './components/TodoList';
import { LinearGradient } from 'expo-linear-gradient';
import SettingsModal from './components/SettingsMenu';

export default class App extends React.Component {
  state = {
    settingsVisible: false,
  };

  toggleSettingsModal() {
    this.setState({ settingsVisible: !this.state.settingsVisible });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
        <Modal
        animationType="slide"
        visible={this.state.settingsVisible}
        onRequestClose={() => this.toggleSettingsModal}>
        <SettingsModal closeModal={() => this.toggleSettingsModal()} />
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
        <LinearGradient
          colors={['#4158D0', '#46578C', '#081F65']}
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
  content: { // All content, needed for gradient 
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
  grad: {
    ...StyleSheet.absoluteFillObject, // Position the gradient to cover the entire screen
  },
});
