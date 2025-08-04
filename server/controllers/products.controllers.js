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
export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM producto");

    for (const product of products) {
      const [variantes] = await pool.query(
        "SELECT id_variante, talla, color, stock FROM variante WHERE id_producto = ?",
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
export const getProduct = async (req, res) => {
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

export const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Parsear variantes desde string JSON
    let variantes = [];
    try {
      variantes = req.body.variantes ? JSON.parse(req.body.variantes) : [];
    } catch (e) {
      console.error('Error parsing variantes:', e);
      throw new Error('Formato de variantes inválido');
    }

    // Validar variantes
    if (!Array.isArray(variantes)) {
      throw new Error('Las variantes deben ser un array');
    }

    const imagen_url = req.file ? `/images/products/${req.file.filename}` : null;

    // Insertar producto principal
    const [productResult] = await connection.query(
      "INSERT INTO producto (nombre, modelo, tipo, descripcion, precio_base, disponible, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.body.nombre, req.body.modelo, req.body.tipo, req.body.descripcion,
      req.body.precio_base, req.body.disponible, imagen_url]
    );

    const productId = productResult.insertId;
    const createdVariants = [];

    // Insertar cada variante
    for (const variant of variantes) {
      if (!variant.talla || !variant.color) {
        throw new Error('Talla y color son requeridos en todas las variantes');
      }

      const [variantResult] = await connection.query(
        "INSERT INTO variante (id_producto, talla, color, stock) VALUES (?, ?, ?, ?)",
        [productId, variant.talla, variant.color, variant.stock || 0]
      );

      createdVariants.push({
        id_variante: variantResult.insertId,
        talla: variant.talla,
        color: variant.color,
        stock: variant.stock || 0
      });
    }

    await connection.commit();

    res.status(201).json({
      id: productId,
      nombre: req.body.nombre,
      modelo: req.body.modelo,
      tipo: req.body.tipo,
      descripcion: req.body.descripcion,
      precio_base: req.body.precio_base,
      disponible: req.body.disponible,
      imagen_url,
      variantes: createdVariants
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en createProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    connection.release();
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Parsear variantes desde string JSON si viene en FormData
    // Parsear variantes desde string JSON si viene en FormData
    let variantes = [];
    try {
      // Asegurarse de que req.body.variantes existe y es un string
      if (req.body.variantes && typeof req.body.variantes === 'string') {
        variantes = JSON.parse(req.body.variantes);
        // Validar que sea un array
        if (!Array.isArray(variantes)) {
          throw new Error('Formato de variantes inválido: debe ser un array');
        }
      } else if (Array.isArray(req.body.variantes)) {
        variantes = req.body.variantes;
      } else {
        variantes = [];
      }
    } catch (e) {
      console.error("Error parsing variants:", e);
      throw new Error('Formato de variantes inválido');
    }

    // Obtener el producto actual para manejar la imagen
    const [currentProduct] = await connection.query(
      "SELECT imagen_url FROM producto WHERE id_producto = ?",
      [req.params.id]
    );

    let imagen_url = currentProduct[0]?.imagen_url || null;

    // Si se subió nueva imagen
    // En la parte donde manejas la imagen en updateProduct:
    if (req.file) {
      // Eliminar la imagen anterior si existe
      if (imagen_url) {
        const imagePath = path.join(__dirname, '../../public', imagen_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      imagen_url = `/images/products/${req.file.filename}`;
    }

    // 1. Actualizar producto principal
    const [productResult] = await connection.query(
      "UPDATE producto SET nombre = ?, modelo = ?, tipo = ?, descripcion = ?, precio_base = ?, disponible = ?, imagen_url = ? WHERE id_producto = ?",
      [
        req.body.nombre,
        req.body.modelo,
        req.body.tipo,
        req.body.descripcion,
        parseFloat(req.body.precio_base),
        req.body.disponible ? 1 : 0,
        imagen_url,
        req.params.id
      ]
    );

    if (productResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 2. Manejo de variantes (eliminar las que no vienen en el request)
    await connection.query(
      "DELETE FROM variante WHERE id_producto = ? AND id_variante NOT IN (?)",
      [
        req.params.id,
        variantes.filter(v => v.id_variante).map(v => v.id_variante)
      ]
    );

    // 3. Actualizar/insertar variantes
    for (const variant of variantes) {
      if (!variant.talla || !variant.color) {
        throw new Error('Talla y color son requeridos en todas las variantes');
      }

      if (variant.id_variante) {
        await connection.query(
          "UPDATE variante SET talla = ?, color = ?, stock = ? WHERE id_variante = ?",
          [variant.talla, variant.color, parseInt(variant.stock), variant.id_variante]
        );
      } else {
        await connection.query(
          "INSERT INTO variante (id_producto, talla, color, stock) VALUES (?, ?, ?, ?)",
          [req.params.id, variant.talla, variant.color, parseInt(variant.stock)]
        );
      }
    }

    await connection.commit();

    // Obtener el producto actualizado con sus variantes
    const [updatedProduct] = await connection.query(
      "SELECT * FROM producto WHERE id_producto = ?",
      [req.params.id]
    );

    const [productVariants] = await connection.query(
      "SELECT * FROM variante WHERE id_producto = ?",
      [req.params.id]
    );

    res.json({
      ...updatedProduct[0],
      variantes: productVariants
    });

  } catch (error) {
    await connection.rollback();
    console.error("Error en updateProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      sqlMessage: error.sqlMessage
    });
  } finally {
    connection.release();
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Obtener información del producto para eliminar la imagen
    const [product] = await connection.query(
      "SELECT imagen_url FROM producto WHERE id_producto = ?",
      [req.params.id]
    );

    // 2. Eliminar variantes
    const [deleteVariants] = await connection.query(
      'DELETE FROM variante WHERE id_producto = ?',
      [req.params.id]
    );

    // 3. Eliminar producto
    const [deleteProduct] = await connection.query(
      'DELETE FROM producto WHERE id_producto = ?',
      [req.params.id]
    );

    if (deleteProduct.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // 4. Eliminar la imagen si existe
    if (product[0]?.imagen_url) {
      const imagePath = path.join(__dirname, '../../public', product[0].imagen_url);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado con éxito',
      variantsDeleted: deleteVariants.affectedRows
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en deleteProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  } finally {
    connection.release();
  }
};