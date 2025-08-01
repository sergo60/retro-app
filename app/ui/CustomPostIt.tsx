import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function CustomPostIt({
  onDelete,
  text,
  pseudo,
}: {
  onDelete: () => void;
  text: string;
  pseudo: string;
}) {
  const [value, setValue] = useState(text);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        value={value}
        onChangeText={setValue}
        placeholder="Écris ici..."
        placeholderTextColor="#666"
      />
      <Text style={styles.pseudo}>{pseudo}</Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <AntDesign name="close" size={16} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff68f',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    minHeight: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
  },
  pseudo: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
});
