// controllers/cartController.js
import { pool } from '../db.js';

export const createCart = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      id_cliente,
      id_producto,
      cantidad,
      direccion, // Agregar la dirección al destructurar el body
      detalles_pedido
    } = req.body;

    // 1. Manejar detalles_pedido condicionalmente
    let id_detalles_pedido = null;
    if (detalles_pedido) {
      const {
        posicion,
        tamaño,
        notas,
        precio_extra
      } = detalles_pedido;
      const [detallesResult] = await connection.query(
        "INSERT INTO detalles_pedido (posicion, tamaño, notas, precio_extra) VALUES (?, ?, ?, ?)",
        [posicion, tamaño, notas, precio_extra]
      );
      id_detalles_pedido = detallesResult.insertId;
    }

    // 2. Obtener precio_base del producto
    const [productPriceResult] = await connection.query(
      "SELECT precio_base FROM producto WHERE id_producto = ?",
      [id_producto]
    );

    if (productPriceResult.length === 0) {
      throw new Error("Producto no encontrado");
    }

    const precio_unitario = productPriceResult[0].precio_base;

    // 3. Crear el pedido
    const estado = 'pendiente'; // Estado inicial del pedido
    const [pedidoResult] = await connection.query(
      "INSERT INTO pedido (precio_unitario, estado, direccion, id_detalles_pedido, id_producto) VALUES (?, ?, ?, ?, ?)",
      [precio_unitario, estado, direccion, id_detalles_pedido, id_producto]
    );

    const id_pedido = pedidoResult.insertId;

    // 4. Crear el carrito y calcular el costo total
    const costo_total = (parseFloat(precio_unitario) + (detalles_pedido?.precio_extra || 0)) * parseInt(cantidad);
    await connection.query(
      "INSERT INTO carrito (cantidad, costo_total, id_pedido, id_cliente) VALUES (?, ?, ?, ?)",
      [cantidad, costo_total, id_pedido, id_cliente]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Carrito creado con éxito',
      id_pedido,
      costo_total,
      id_producto,
      cantidad
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en createCart:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el carrito',
      error: error.message
    });
  } finally {
    connection.release();
  }
};


export const getCart = async (req, res) => {
  try {
    const { id } = req.params; // Extrae 'id' de req.params
    console.log(id); // Esto imprimirá '3' en la consola

    const [cart] = await pool.query(
      `SELECT
        c.cantidad,
        c.costo_total,
        p.nombre AS nombre_producto,
        p.imagen_url,
        pe.precio_unitario,
        pe.estado,
        d.posicion AS detalles_posicion,
        d.tamaño AS detalles_tamano,
        d.notas AS detalles_notas,
        d.precio_extra AS detalles_precio_extra
      FROM carrito c
      JOIN pedido pe ON c.id_pedido = pe.id_pedido
      JOIN producto p ON pe.id_producto = p.id_producto
      LEFT JOIN detalles_pedido d ON pe.id_detalles_pedido = d.id_detalles_pedido
      WHERE c.id_cliente = ?`,
      [id] // Usa la variable 'id' en la consulta
    );

    if (cart.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado para este cliente'
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    console.error('Error en getCart:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el carrito',
      error: error.message
    });
  }
};