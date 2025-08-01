import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

type Props = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
};

const CustomTextInput = ({ label, placeholder, value, onChangeText, required = false }: Props) => {
  const [touched, setTouched] = useState(false);

  const showError = required && touched && value.trim() === '';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, showError && styles.errorInput]}
        placeholder={placeholder}
        value={value}
        onChangeText={text => {
          onChangeText(text);
          if (!touched) setTouched(true);
        }}
        onBlur={() => setTouched(true)}
      />

      {showError && <Text style={styles.errorText}>Ce champ est requis.</Text>}
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

export default CustomTextInput;
