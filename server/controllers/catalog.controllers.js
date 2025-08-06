// controllers/productController.js
import { pool } from '../db.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Obtener todos los productos con sus variantes
export const getCatalogCustomizable = async (req, res) => {

  try {
    const [products] = await pool.query('SELECT * FROM producto WHERE tipo = "perzonalizable" AND disponible = 1')

    for (const product of products) {
      const [variantes] = await pool.query(
        'SELECT id_variante, talla, color, stock FROM variante WHERE id_producto = ? ',
        [product.id_producto]
      );
      product.variantes = variantes; // Nota el plural
      product.disponible = Boolean(product.disponible);
    }

    res.json(products);
  } catch (error) {
    console.error('Error en getProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const getCatalogStandard = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM producto WHERE tipo = "estandar" AND disponible = 1')

    for (const product of products) {
      const [variantes] = await pool.query(
        'SELECT id_variante, talla, color, stock FROM variante WHERE id_producto = ?',
        [product.id_producto]
      );
      product.variantes = variantes; // Nota el plural
      product.disponible = Boolean(product.disponible);
    }

    res.json(products);
  } catch (error) {
    console.error('Error en getProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};


// Obtener un producto específico con sus variantes
export const getFromCatalog = async (req, res) => {
  try {
    const [product] = await pool.query(
      "SELECT * FROM producto WHERE id_producto = ?",
      [req.params.id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const [variants] = await pool.query(
      "SELECT * FROM variante WHERE id_producto = ?",
      [req.params.id]
    );

    const result = {
      ...product[0],
      variantes: variants
    };

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
