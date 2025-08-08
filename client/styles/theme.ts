import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export const colors = {
  primary: '#E53935', // Un tono de rojo vibrante
  primaryDark: '#B71C1C',
  secondary: '#FFCDD2',
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#212121',
  textLight: '#757575',
  placeholder: '#BDBDBD',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#4CAF50',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  small: {
    fontSize: 14,
    color: colors.textLight,
  },
};

export const layout = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  card: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...this.shadow,
  },
};

export const forms = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: colors.primary,
    marginTop: 10,
  }
});

export const productStyles = StyleSheet.create({
  productCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    ...layout.shadow,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  productPrice: {
    fontSize: 16,
    color: colors.primaryDark,
    fontWeight: '600',
    marginTop: 4,
  },
});

export const cartStyles = StyleSheet.create({
  cartItemContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    width: ITEM_WIDTH,
    ...layout.shadow,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  deleteButtonText: {
    color: colors.cardBackground,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
