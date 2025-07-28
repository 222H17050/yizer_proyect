import React from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { styles } from '../styles'; // Ruta actualizada

const { width } = Dimensions.get('window');

const SideMenu = ({ isMenuOpen, setIsMenuOpen, setScreen }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isMenuOpen}
      onRequestClose={() => setIsMenuOpen(false)}
    >
      <TouchableOpacity
        style={styles.menu_overlay}
        activeOpacity={1}
        onPressOut={() => setIsMenuOpen(false)}
      >
        <View style={styles.menu_container}>
          <TouchableOpacity style={styles.menu_item} onPress={() => { setScreen('home'); setIsMenuOpen(false); }}>
            <Text style={styles.menu_item_text}>INICIO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menu_item} onPress={() => { setScreen('myOrders'); setIsMenuOpen(false); }}>
            <Text style={styles.menu_item_text}>MI COMPRA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menu_item} onPress={() => { setScreen('personalization'); setIsMenuOpen(false); }}>
            <Text style={styles.menu_item_text}>PERSONALIZACIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menu_item} onPress={() => { setScreen('authSelection'); setIsMenuOpen(false); }}>
            <Text style={styles.menu_item_text}>AUTENTICACIÓN</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SideMenu;
