import { pool } from "../db.js";

export const getOrder = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        pr.imagen_url,
        c.correo,
        c.nombre,
        p.direccion,
        pr.modelo,
        v.talla,
        v.color,
        car.cantidad,
        p.fecha_creacion
      FROM
        cliente c
      INNER JOIN
        carrito car ON c.id_cliente = car.id_cliente
      INNER JOIN
        pedido p ON car.id_pedido = p.id_pedido
      INNER JOIN
        producto pr ON p.id_producto = pr.id_producto
      INNER JOIN
        variante v ON pr.id_producto = v.id_producto
      ORDER BY
        c.nombre, p.direccion;
      `
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "No se encontraron pedidos en la base de datos." });
    }

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal: " + error.message });
  }
};