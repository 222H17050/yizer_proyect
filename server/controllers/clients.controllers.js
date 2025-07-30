import { pool } from '../db.js';

// --- 1. Crear un nuevo cliente (POST) ---
export const createClient = async (req, res) => {
  try {
    const { nombre, correo, contraseña, telefono, direccion } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !correo || !contraseña || !telefono || !direccion) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos (nombre, correo, contraseña, telefono, direccion) son requeridos'
      });
    }
    // Insertar el nuevo cliente en la base de datos
    const [result] = await pool.query(
      "INSERT INTO cliente (nombre, correo, contraseña, telefono, direccion) VALUES (?, ?, ?, ?, ?)",
      [nombre, correo, contraseña, telefono, direccion] // Usar hashedPassword aquí si implementas bcrypt
    );

    // Obtener el cliente recién creado (sin la contraseña)
    const [rows] = await pool.query(
      "SELECT id_cliente, nombre, correo, telefono, direccion FROM cliente WHERE id_cliente = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error en createClient:', error);

    // Manejar error de correo duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado para otro cliente'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
};

// --- 2. Obtener todos los clientes (GET) ---
export const getClients = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_cliente, nombre, correo, telefono, direccion FROM cliente");
    res.json({
      success: true,
      message: 'Clientes obtenidos exitosamente',
      data: rows
    });
  } catch (error) {
    console.error('Error en getClients:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
};

// --- 3. Obtener un cliente por ID (GET /:id) ---
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id_cliente, nombre, correo, telefono, direccion FROM cliente WHERE id_cliente = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cliente obtenido exitosamente',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error en getClientById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
};

// --- 4. Actualizar un cliente por ID (PUT /:id) ---
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contraseña, telefono, direccion } = req.body;
    const fields = [];
    const values = [];

    if (nombre) {
      fields.push("nombre = ?");
      values.push(nombre);
    }
    if (correo) {
      fields.push("correo = ?");
      values.push(correo);
    }
    if (contraseña) {
      fields.push("contraseña = ?"); // Mantengo esto para tu ejemplo actual
      values.push(contraseña);
    }
    if (telefono) {
      fields.push("telefono = ?");
      values.push(telefono);
    }
    if (direccion) {
      fields.push("direccion = ?");
      values.push(direccion);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id); // Añadir el ID al final para la cláusula WHERE

    const [result] = await pool.query(
      `UPDATE cliente SET ${fields.join(", ")} WHERE id_cliente = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado o no se realizaron cambios'
      });
    }

    // Obtener el cliente actualizado (sin la contraseña)
    const [rows] = await pool.query(
      "SELECT id_cliente, nombre, correo, telefono, direccion FROM cliente WHERE id_cliente = ?",
      [id]
    );

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error en updateClient:', error);

    // Manejar error de correo duplicado si se intenta actualizar el correo a uno ya existente
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'El nuevo correo electrónico ya está registrado para otro cliente'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

// --- 5. Eliminar un cliente por ID (DELETE /:id) ---
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cliente eliminado exitosamente',
      data: { id_cliente: id } // Devolver el ID del cliente eliminado
    });

  } catch (error) {
    console.error('Error en deleteClient:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
};

// --- 6. Verificar credenciales de cliente (similar a verifyAdmin) ---
export const verifyClient = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validar que ambos campos estén presentes
    if (!correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar el cliente en la base de datos
    const [rows] = await pool.query(
      "SELECT id_cliente, nombre, correo, contraseña, telefono, direccion FROM cliente WHERE correo = ?",
      [correo]
    );

    // Verificar si el cliente existe
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const client = rows[0];

    if (client.contraseña !== contraseña) { // Mantengo esto para tu ejemplo actual
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Si todo es correcto, devolver información básica del cliente (sin contraseña)
    const clientData = {
      id_cliente: client.id_cliente,
      nombre: client.nombre,
      correo: client.correo,
      telefono: client.telefono,
      direccion: client.direccion
    };

    res.json({
      success: true,
      message: 'Autenticación de cliente exitosa',
      data: clientData
    });

  } catch (error) {
    console.error('Error en verifyClient:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar credenciales de cliente',
      error: error.message
    });
  }
};