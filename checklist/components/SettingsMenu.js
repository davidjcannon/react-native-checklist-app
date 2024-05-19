import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default class SettingsModal extends React.Component {
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
          <Text>Settings Menu Placeholder</Text>
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
  },
  close: {
    paddingRight: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});