import mysql from 'mysql2/promise'; // Importa el módulo completo como 'mysql'

export const pool = mysql.createPool({ // Usa 'mysql.createPool'
    host: "localhost",
    port: "3306", // El puerto es un número, aunque "3306" como string también suele funcionar
    user: "root",
    password: "tu_contraseña", // ¡Asegúrate de cambiar esto!
    database: "YIZER"
});