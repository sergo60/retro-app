import React from 'react';
import { View } from 'react-native';

export default function SizedBox({ height = 0, width = 0 }) {
  return <View style={{ height, width }} />;
}
