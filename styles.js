import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  icon: {
    fontSize: 26,
    color: 'black',
    paddingLeft: 6,
    opacity: 1,
  },
  categoryText: {
    paddingLeft: 6,
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 4,
    outlineStyle: 'none',
    width: '85%',
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    marginBottom: 5,
    borderRadius: 10,
  },
});