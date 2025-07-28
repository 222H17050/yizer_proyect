import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles'; // Ruta actualizada

const CustomButton = ({ title, onPress, style, text_style, disabled = false }) => (
  <TouchableOpacity
    style={[styles.button, style, disabled && styles.button_disabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={[styles.button_text, text_style]}>{title}</Text>
  </TouchableOpacity>
);

export default CustomButton;
