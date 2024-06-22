import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SwipeableItem({ onEdit, onDelete, isCategory = false }) {
  return (
    <Animated.View style={{ flexDirection: 'row' }}>
      {/* Category Settings Button (only for categories) */}
      {isCategory && (
        <TouchableOpacity onPress={() => console.log('Category Settings')}>
          <Animated.View style={[styles.swipeButton, { backgroundColor: '#2196F3' }]}>
            <Feather name="settings" style={{ color: 'white', fontSize: 30 }} />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Edit Button */}
      <TouchableOpacity onPress={onEdit}>
        <Animated.View style={[styles.swipeButton, { backgroundColor: '#388E3C' }]}>
          <Feather name="edit-2" style={{ color: 'white', fontSize: 30 }} />
        </Animated.View>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity onPress={onDelete}>
        <Animated.View style={[styles.swipeButton, { backgroundColor: '#F44336' }]}>
          <Feather name="trash-2" style={{ color: 'white', fontSize: 30 }} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
