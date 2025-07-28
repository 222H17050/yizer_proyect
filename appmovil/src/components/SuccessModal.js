import React from 'react';
import { Modal, View, Text, Image } from 'react-native';
import CustomButton from './CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const SuccessModal = ({ showSuccessModal, handle_close_success_modal }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSuccessModal}
      onRequestClose={handle_close_success_modal}
    >
      <View style={styles.centered_view}>
        <View style={styles.modal_view}>
          <Text style={styles.modal_title}>¡Compra exitosa!</Text>
          <Text style={styles.modal_text}>Tu pedido ha sido procesado.</Text>
          <Image
            source={{ uri: 'https://placehold.co/100x100/B12A2A/FFFFFF?text=✓' }}
            style={styles.success_image}
          />
          <CustomButton
            title="Aceptar"
            onPress={handle_close_success_modal}
            style={styles.modal_button}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
