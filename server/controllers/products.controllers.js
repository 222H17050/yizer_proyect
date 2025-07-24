import { pool } from "../db.js";

export const getproducts = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM producto"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getproduct = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM producto WHERE id_producto = ?", [
      req.params.id,
    ]);

    if (result.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createproducts = async (req, res) => {
  try {
    const { nombre, modelo, tipo, descripcion, precio_base, disponible } = req.body;
    
    const [result] = await pool.query(
      "INSERT INTO producto(nombre, modelo, tipo, descripcion, precio_base, disponible) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, modelo, tipo, descripcion, precio_base, disponible]
    );
    res.json({
      id: result.insertId,
      nombre,
      modelo,
      tipo,
      descripcion,
      precio_base,
      disponible
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateproducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, modelo, tipo, descripcion, precio_base, disponible } = req.body;
    
    const [result] = await pool.query(
      "UPDATE producto SET nombre = ?, modelo = ?, tipo = ?, descripcion = ?, precio_base = ?, disponible = ? WHERE id_producto = ?",
      [nombre, modelo, tipo, descripcion, precio_base, disponible, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({
      id,
      nombre,
      modelo,
      tipo,
      descripcion,
      precio_base,
      disponible
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteproducts = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM producto WHERE id_producto = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};