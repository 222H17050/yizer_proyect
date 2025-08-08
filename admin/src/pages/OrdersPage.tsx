import { useState, useEffect } from 'react';
import axios from 'axios';

// Define la interfaz para los elementos del pedido, reflejando la nueva estructura del backend
interface OrderItem {
    imagen_url: string;
    correo: string;
    nombre: string;
    direccion: string;
    modelo: string;
    talla: string;
    color: string;
    cantidad: number;
    fecha_creacion: string; // La fecha de creación ahora se mostrará por elemento
}

function OrdersPage() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Función para obtener los pedidos del backend
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/order');
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los pedidos');
                setLoading(false);
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    // Muestra un mensaje de carga mientras se obtienen los datos
    if (loading) return (
        <div className="loading">Cargando pedidos...</div>
    );
    // Muestra un mensaje de error si la carga falla
    if (error) return (
        <div className="error">{error}</div>
    );

    // Agrupa los pedidos solo por cliente (correo), ya que la dirección y fecha se mostrarán por elemento en la tabla
    const groupOrdersByCustomer = orders.reduce<Record<string, OrderItem[]>>((acc, order) => {
        // Usa el correo como clave única para cada cliente
        const key = order.correo;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {});

    // Obtener las claves de los grupos y ordenarlas para una visualización consistente
    const sortedGroupKeys = Object.keys(groupOrdersByCustomer).sort((a, b) => {
        const orderA = groupOrdersByCustomer[a][0]; // Tomar el primer pedido de cada grupo para el nombre del cliente
        const orderB = groupOrdersByCustomer[b][0];

        // Ordenar por nombre de cliente
        return orderA.nombre.localeCompare(orderB.nombre);
    });

    return (
        <div className="inventory-container">
            <h1 className="title">Gestión de Pedidos</h1>

            <div className="card">
                {/* Verifica si hay pedidos para mostrar */}
                {sortedGroupKeys.length > 0 ? (
                    // Itera sobre cada grupo de pedidos (por cliente)
                    sortedGroupKeys.map((key) => {
                        const customerOrders = groupOrdersByCustomer[key];
                        const firstOrder = customerOrders[0]; // Toma el primer elemento para obtener la información del cliente

                        // Ordenar los artículos dentro de cada pedido por fecha de creación (más reciente primero) y luego por modelo
                        const sortedCustomerOrders = [...customerOrders].sort((a, b) => {
                            const dateCompare = new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
                            if (dateCompare !== 0) {
                                return dateCompare;
                            }
                            return a.modelo.localeCompare(b.modelo);
                        });

                        return (
                            <div key={key} className="order-group-card">
                                {/* Información del cliente */}
                                <div className="order-customer-info">
                                    <h3 className="order-customer-name">Cliente: {firstOrder.nombre}</h3>
                                    <p className="order-customer-email"><strong>Correo:</strong> {firstOrder.correo}</p>
                                </div>
                                
                                {/* Tabla de artículos del pedido */}
                                <div className="order-table-container">
                                    <table className="table">
                                        <thead className="header">
                                            <tr>
                                                <th className="th th-image">Imagen</th>
                                                <th className="th">Modelo</th>
                                                <th className="th">Talla</th>
                                                <th className="th">Color</th>
                                                <th className="th">Cantidad</th>
                                                <th className="th">Dirección de Envío</th> {/* Nueva columna para la dirección */}
                                                <th className="th th-date">Fecha del Pedido</th>
                                            </tr>
                                        </thead>
                                        <tbody className="body">
                                            {sortedCustomerOrders.map((item, index) => (
                                                <tr key={index} className="order-item-row">
                                                    <td className="td td-image">
                                                        {item.imagen_url ? (
                                                            <img
                                                                src={`http://localhost:4000${item.imagen_url}`}
                                                                alt={item.modelo}
                                                                className="product-image"
                                                                onError={(e) => {
                                                                    // Manejo de errores para imágenes: muestra una imagen de placeholder
                                                                    e.currentTarget.src = 'https://placehold.co/64x64/cccccc/333333?text=No+Img';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="no-image">Sin imagen</div>
                                                        )}
                                                    </td>
                                                    <td className="td order-item-model">{item.modelo}</td>
                                                    <td className="td order-item-details">{item.talla}</td>
                                                    <td className="td order-item-details">{item.color}</td>
                                                    <td className="td order-item-quantity">{item.cantidad}</td>
                                                    <td className="td order-item-details">{item.direccion}</td> {/* Muestra la dirección por elemento */}
                                                    <td className="td order-item-date">
                                                        {new Date(item.fecha_creacion).toLocaleDateString('es-MX', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // Mensaje si no se encuentran pedidos
                    <div className="empty">
                        <p>No se encontraron pedidos en la base de datos.</p>
                        <p>Por favor, verifica la conexión con el backend o si hay datos disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
