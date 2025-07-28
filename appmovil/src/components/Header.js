import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles'; // Ruta actualizada

const Header = ({ onMenuPress }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onMenuPress} style={styles.menu_icon}>
      <Text style={styles.menu_text}>☰</Text>
    </TouchableOpacity>
    <Text style={styles.header_title}>YIZER</Text>
    <View style={{ width: 30 }} />
  </View>
);

export default Header;
