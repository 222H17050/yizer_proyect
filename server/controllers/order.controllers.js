import { pool } from "../db.js";

export const getOrder = async (req, res) => {
  try {
    // Consulta que incluye información relacionada (cliente, dirección, pago)
    const [result] = await pool.query(`
      SELECT p.*, 
             c.nombre as cliente_nombre, 
             c.correo as cliente_correo,
             d.direccion as direccion_completa,
             d.municipio,
             d.codigo_postal,
             pg.total as monto_total
      FROM pedido p
      LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
      LEFT JOIN direccion d ON p.id_direccion = d.id_direccion
      LEFT JOIN pago pg ON p.id_pago = pg.id_pago
    `);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT p.*, 
             c.nombre as cliente_nombre, 
             c.correo as cliente_correo,
             d.direccion as direccion_completa,
             d.municipio,
             d.codigo_postal,
             pg.total as monto_total,
             ip.cantidad,
             ip.precio_unitario,
             v.talla,
             v.color,
             pr.nombre as producto_nombre
      FROM pedido p
      LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
      LEFT JOIN direccion d ON p.id_direccion = d.id_direccion
      LEFT JOIN pago pg ON p.id_pago = pg.id_pago
      LEFT JOIN item_pedido ip ON p.id_item = ip.id_item
      LEFT JOIN variante v ON ip.id_variante = v.id_variante
      LEFT JOIN producto pr ON v.id_producto = pr.id_producto
      WHERE p.id_pedido = ?
    `, [req.params.id]);

    if (result.length === 0)
      return res.status(404).json({ message: "Order not found" });

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_entrega, notas, estado } = req.body;
    
    // Solo permitimos actualizar ciertos campos del pedido
    const [result] = await pool.query(
      "UPDATE pedido SET fecha_entrega = ?, notas = ? WHERE id_pedido = ?",
      [fecha_entrega, notas, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Order not found" });

    // Si se actualizó el estado, actualizamos también el item_pedido relacionado
    if (estado) {
      await pool.query(
        "UPDATE item_pedido SET estado = ? WHERE id_item IN (SELECT id_item FROM pedido WHERE id_pedido = ?)",
        [estado, id]
      );
    }

    // Devolvemos el pedido actualizado
    const [updatedOrder] = await pool.query(
      "SELECT * FROM pedido WHERE id_pedido = ?",
      [id]
    );

    res.json(updatedOrder[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    // Primero obtenemos los IDs relacionados para eliminarlos después
    const [order] = await pool.query(
      "SELECT id_pago, id_item FROM pedido WHERE id_pedido = ?",
      [req.params.id]
    );

    if (order.length === 0)
      return res.status(404).json({ message: "Order not found" });

    // Iniciamos una transacción para eliminar todos los registros relacionados
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Eliminamos el pedido
      await connection.query("DELETE FROM pedido WHERE id_pedido = ?", [req.params.id]);
      
      // Eliminamos el pago asociado
      await connection.query("DELETE FROM pago WHERE id_pago = ?", [order[0].id_pago]);
      
      // Eliminamos el item de pedido
      await connection.query("DELETE FROM item_pedido WHERE id_item = ?", [order[0].id_item]);

      await connection.commit();
      return res.sendStatus(204);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { 
      id_cliente, 
      id_direccion, 
      fecha_entrega, 
      notas,
      items, // Array de items del pedido
      subtotal,
      costo_envio,
      total
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Crear el pago
      const [pagoResult] = await connection.query(
        "INSERT INTO pago (subtotal, costo_envio, total) VALUES (?, ?, ?)",
        [subtotal, costo_envio, total]
      );
      const id_pago = pagoResult.insertId;

      // 2. Crear los items del pedido
      let id_item;
      for (const item of items) {
        const [itemResult] = await connection.query(
          "INSERT INTO item_pedido (precio_unitario, estado, cantidad, id_variante) VALUES (?, 'pendiente', ?, ?)",
          [item.precio_unitario, item.cantidad, item.id_variante]
        );
        id_item = itemResult.insertId;

        // Si hay personalizaciones, las insertamos
        if (item.personalizacion) {
          await connection.query(
            "INSERT INTO personalizacion (posicion, tamaño, notas, precio_extra, id_variante) VALUES (?, ?, ?, ?, ?)",
            [
              item.personalizacion.posicion,
              item.personalizacion.tamaño,
              item.personalizacion.notas,
              item.personalizacion.precio_extra || 0,
              item.id_variante
            ]
          );
        }
      }

      // 3. Crear el pedido
      const [pedidoResult] = await connection.query(
        "INSERT INTO pedido (fecha_pedido, fecha_entrega, notas, id_cliente, id_pago, id_direccion, id_item) VALUES (NOW(), ?, ?, ?, ?, ?, ?)",
        [fecha_entrega, notas, id_cliente, id_pago, id_direccion, id_item]
      );

      await connection.commit();

      // Devolver el pedido creado con toda su información
      const [newOrder] = await pool.query(`
        SELECT p.*, 
               pg.subtotal,
               pg.costo_envio,
               pg.total
        FROM pedido p
        JOIN pago pg ON p.id_pago = pg.id_pago
        WHERE p.id_pedido = ?
      `, [pedidoResult.insertId]);

      res.status(201).json(newOrder[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};