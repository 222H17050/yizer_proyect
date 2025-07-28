// controllers/productController.js
import { pool } from '../db.js';

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

    const { nombre, modelo, tipo, descripcion, precio_base, disponible, variantes = [] } = req.body;

    // 1. Insertar producto principal
    const [productResult] = await connection.query(
      "INSERT INTO producto (nombre, modelo, tipo, descripcion, precio_base, disponible) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, modelo, tipo, descripcion, precio_base, disponible]
    );
    
    const productId = productResult.insertId;

    // 2. Insertar variantes si existen
    const createdVariants = [];
    for (const variant of variantes) {
      const [variantResult] = await connection.query(
        "INSERT INTO variante (id_producto, talla, color, stock) VALUES (?, ?, ?, ?)",
        [productId, variant.talla, variant.color, variant.stock || 0]
      );
      
      createdVariants.push({
        id_variante: variantResult.insertId,
        id_producto: productId,
        talla: variant.talla,
        color: variant.color,
        stock: variant.stock || 0
      });
    }

    await connection.commit();

    res.status(201).json({
      id: productId,
      nombre,
      modelo,
      tipo,
      descripcion,
      precio_base,
      disponible,
      variantes: createdVariants
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en createProduct:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const { nombre, modelo, tipo, descripcion, precio_base, disponible, variantes } = req.body;
    
    // Iniciar transacción
    await pool.query("START TRANSACTION");
    
    // 1. Actualizar producto principal - CAMBIO AQUÍ: id_producto en lugar de id
    const [productResult] = await pool.query(
      "UPDATE producto SET nombre = ?, modelo = ?, tipo = ?, descripcion = ?, precio_base = ?, disponible = ? WHERE id_producto = ?",
      [nombre, modelo, tipo, descripcion, parseFloat(precio_base), disponible ? 1 : 0, req.params.id]
    );
    
    if (productResult.affectedRows === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    // 2. Actualizar variantes existentes y agregar nuevas
    if (variantes && variantes.length > 0) {
      for (const variant of variantes) {
        if (variant.id_variante) {
          // Actualizar variante existente
          await pool.query(
            "UPDATE variante SET talla = ?, color = ?, stock = ? WHERE id_variante = ?",
            [variant.talla, variant.color, parseInt(variant.stock), variant.id_variante]
          );
        } else {
          // Insertar nueva variante
          await pool.query(
            "INSERT INTO variante (talla, color, stock, id_producto) VALUES (?, ?, ?, ?)",
            [variant.talla, variant.color, parseInt(variant.stock), req.params.id]
          );
        }
      }
    }
    
    await pool.query("COMMIT");
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error completo:", error); // Log detallado del error
    return res.status(500).json({ 
      message: error.message,
      sqlMessage: error.sqlMessage // Esto muestra el error específico de MySQL
    });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Eliminar variantes (usando id_producto)
    const [deleteVariants] = await connection.query(
      'DELETE FROM variante WHERE id_producto = ?',
      [req.params.id]
    );

    // 2. Eliminar producto (usando id_producto)
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
      error: error.message,
      details: "Verifica que estés usando id_producto en tus consultas SQL"
    });
  } finally {
    connection.release();
  }
};

// Controladores para variantes
export const createVariant = async (req, res) => {
  try {
    const { talla, color, stock } = req.body;
    const productId = req.params.productId;
    
    const [result] = await pool.query(
      "INSERT INTO variante (producto_id, talla, color, stock) VALUES (?, ?, ?, ?)",
      [productId, talla, color, stock]
    );
    
    res.json({
      id: result.insertId,
      producto_id: productId,
      talla,
      color,
      stock
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { talla, color, stock } = req.body;
    
    const [result] = await pool.query(
      "UPDATE variante SET talla = ?, color = ?, stock = ? WHERE id = ? AND producto_id = ?",
      [talla, color, stock, req.params.variantId, req.params.productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Variante no encontrada" });
    }
    
    res.json({ id: req.params.variantId, ...req.body });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM variante WHERE id = ? AND producto_id = ?", 
      [req.params.variantId, req.params.productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Variante no encontrada" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};