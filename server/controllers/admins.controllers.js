import { pool } from '../db.js';

//Ver todos los administradores
export const getAllAdmins = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Obtener todos los administradores (sin contraseñas)
    const [admins] = await connection.query(
      "SELECT id_administrador, nombre, correo FROM administrador"
    );

    res.json({
      success: true,
      count: admins.length,
      data: admins
    });

  } catch (error) {
    console.error('Error en getAllAdmins:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener administradores',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Crear un nuevo administrador
export const createAdmin = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    
    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos (nombre, correo, contraseña) son requeridos'
      });
    }

    // Insertar el nuevo administrador en la base de datos
    const [result] = await pool.query(
      "INSERT INTO administrador (nombre, correo, contraseña) VALUES (?, ?, ?)",
      [nombre, correo, contraseña]
    );
    
    // Obtener el administrador recién creado para devolverlo en la respuesta
    const [rows] = await pool.query(
      "SELECT id_administrador, nombre, correo FROM administrador WHERE id_administrador = ?",
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Error en createAdmin:', error);
    
    // Manejar error de correo duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al crear administrador',
      error: error.message
    });
  }
};

// Eliminar un administrador por ID
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el administrador existe
    const [admin] = await pool.query(
      "SELECT id_administrador FROM administrador WHERE id_administrador = ?",
      [id]
    );
    
    if (admin.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }
    
    // Eliminar el administrador
    await pool.query(
      "DELETE FROM administrador WHERE id_administrador = ?",
      [id]
    );
    
    res.json({
      success: true,
      message: 'Administrador eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error en deleteAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar administrador',
      error: error.message
    });
  }
};

// Verificar credenciales de administrador
export const verifyAdmin = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    // Validar que ambos campos estén presentes
    if (!correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }
    
    // Buscar el administrador en la base de datos
    const [rows] = await pool.query(
      "SELECT id_administrador, nombre, correo, contraseña FROM administrador WHERE correo = ?",
      [correo]
    );
    
    // Verificar si el administrador existe
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    const admin = rows[0];
    
    // Comparar contraseñas (en un caso real debería ser con bcrypt o similar)
    if (admin.contraseña !== contraseña) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Si todo es correcto, devolver información básica del admin (sin contraseña)
    const adminData = {
      id_administrador: admin.id_administrador,
      nombre: admin.nombre,
      correo: admin.correo
    };
    
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      data: adminData
    });
    
  } catch (error) {
    console.error('Error en verifyAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar credenciales',
      error: error.message
    });
  }
};