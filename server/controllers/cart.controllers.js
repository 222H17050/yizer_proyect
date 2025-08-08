// controllers/cart.controllers.js
import { pool } from '../db.js';
import path from 'path';

/**
 * Endpoint para añadir un producto al carrito de compras.
 * Realiza una serie de inserciones en la base de datos dentro de una transacción
 * para asegurar la integridad de los datos.
 */
export const createCart = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    // Inicia una transacción para asegurar que todas las operaciones se completen o se reviertan.
    await connection.beginTransaction();

    const {
      id_cliente,
      id_producto,
      cantidad,
      direccion, // Campo requerido
      detalles_pedido: detallesPedidoJSON // Renombramos para evitar conflicto
    } = req.body;

    // Validación estricta de campos obligatorios
    if (!id_cliente || !id_producto || !cantidad || !direccion) {
      throw new Error("Faltan campos obligatorios: id_cliente, id_producto, cantidad o direccion.");
    }

    // Determina la URL de la imagen si se subió un archivo
    const imagen_url_personalizada = req.file ? `/images/clients/${req.file.filename}` : null;
    
    // CORRECCIÓN CLAVE: Parsear el JSON de detalles_pedido
    let detalles_pedido = {};
    if (detallesPedidoJSON) {
      try {
        detalles_pedido = JSON.parse(detallesPedidoJSON);
        console.log('Detalles de pedido recibidos:', detalles_pedido); // Log para depuración
      } catch (e) {
        throw new Error("El formato de detalles_pedido es inválido.");
      }
    }

    // Paso 1: Manejar los detalles de personalización del pedido.
    let id_detalles_pedido = null;
    if (Object.keys(detalles_pedido).length > 0 || imagen_url_personalizada) {
      // CORRECCIÓN: Se obtienen los valores del objeto `detalles_pedido`
      // de forma más robusta. Si el campo no existe o es null, se usará
      // un string vacío. Esto asegura que se usen los datos enviados
      // por el formulario y se eviten los errores de `NOT NULL`.
      const posicion = detalles_pedido.posicion ?? '';
      const tamano = detalles_pedido.tamano ?? '';
      const notas = detalles_pedido.notas ?? '';
      const precio_extra = detalles_pedido.precio_extra ?? 0;
      
      const [detallesResult] = await connection.query(
        "INSERT INTO detalles_pedido (posicion, tamaño, notas, precio_extra, imagen_url_personalizada) VALUES (?, ?, ?, ?, ?)",
        [posicion, tamano, notas, precio_extra, imagen_url_personalizada]
      );
      id_detalles_pedido = detallesResult.insertId;
    }

    // Paso 2: Obtener el precio base del producto desde la base de datos.
    const [products] = await connection.query(
      "SELECT precio_base FROM producto WHERE id_producto = ?",
      [id_producto]
    );

    // Si el producto no existe, se lanza un error.
    if (products.length === 0) {
      throw new Error(`El producto con ID ${id_producto} no fue encontrado.`);
    }

    const precio_unitario = Number(products[0].precio_base) || 0;

    // Paso 3: Crear el pedido en la tabla `pedido`.
    const [pedidoResult] = await connection.query(
      "INSERT INTO pedido (id_producto, id_detalles_pedido, precio_unitario, estado, direccion) VALUES (?, ?, ?, ?, ?)",
      [id_producto, id_detalles_pedido, precio_unitario, 'pendiente', direccion]
    );
    const id_pedido = pedidoResult.insertId;

    // Paso 4: Calcular el costo total, asegurando que los precios son válidos.
    const precio_extra_validado = (detalles_pedido?.precio_extra && !isNaN(detalles_pedido.precio_extra)) ? detalles_pedido.precio_extra : 0;
    const precio_final = precio_unitario + precio_extra_validado;
    const costo_total = precio_final * cantidad;

    // Paso 5: Crear el registro del carrito en la tabla `carrito`.
    const [cartResult] = await connection.query(
      "INSERT INTO carrito (id_cliente, id_pedido, cantidad, costo_total) VALUES (?, ?, ?, ?)",
      [id_cliente, id_pedido, cantidad, costo_total.toFixed(2)]
    );

    // Si todo fue bien, se confirman los cambios en la base de datos.
    await connection.commit();

    // Envía una respuesta exitosa al cliente.
    res.status(201).json({
      success: true,
      message: 'Producto añadido al carrito correctamente.',
      data: {
        id_carrito: cartResult.insertId,
        id_pedido: id_pedido,
        costo_total: Number(costo_total.toFixed(2))
      }
    });

  } catch (error) {
    // Si algo falló, se revierten todos los cambios de la transacción.
    await connection.rollback();
    console.error('Error en createCart:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el carrito.',
      error: error.message
    });
  } finally {
    // Siempre se libera la conexión a la base de datos.
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
      message: 'Carrito encontrado',
      cart: cart,
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