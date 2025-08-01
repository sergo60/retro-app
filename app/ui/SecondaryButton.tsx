import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
};

export default function SecondaryButton({ onPress, title }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    marginVertical: 15,
    backgroundColor: '#FFFFFF',
    borderColor: '#5C6BC0',
    borderWidth: 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  text: {
    color: '#5C6BC0',
    fontSize: 18,
    fontWeight: '600',
  },
});
