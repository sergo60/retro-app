import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';

type Props = {
  label?: string;
  placeholder: string;
  value: string;
  onPress: () => void;
  required?: boolean;
};

const CustomDateInput = ({ label, placeholder, value, onPress, required = false }: Props) => {
  const [touched, setTouched] = useState(false);

  const showError = required && touched && value.trim() === '';

  useEffect(() => {
    if (value) setTouched(true);
  }, [value]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <TextInput
          placeholder={placeholder}
          value={value}
          editable={false}
          pointerEvents="none"
          style={[styles.input, showError && styles.errorInput]}
        />
      </TouchableOpacity>

      {showError && <Text style={styles.errorText}>La date est requise.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default CustomDateInput;
