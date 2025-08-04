import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Variant {
    id_variante: number;
    talla: string;
    color: string;
    stock: number;
}

interface Product {
    id_producto: number;
    nombre: string;
    modelo: string;
    tipo: string;
    descripcion: string;
    precio_base: number;
    disponible: boolean;
    imagen_url: string | null;
    variantes: Variant[];
}

function InventoryPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos');
                setLoading(false);
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteProduct = async (productId: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto y todas sus variantes?')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:4000/products/${productId}`);

            if (response.data.success) {
                alert('Producto eliminado correctamente');
                setProducts(products.filter(p => p.id_producto !== productId));
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert(error || 'Error al eliminar producto');
        }
    };

    if (loading) return <div className="loading">Cargando inventario...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="inventory-container">
            <h1 className="title">Inventario de Productos</h1>

            <div className="card">
                <table className="table">
                    <thead className="header">
                        <tr>
                            <th className="th">Imagen</th>
                            <th className="th">Producto</th>
                            <th className="th">Modelo</th>
                            <th className="th">Precio</th>
                            <th className="th">Estado</th>
                            <th className="th">Variantes</th>
                            <th className="th"></th>
                        </tr>
                    </thead>
                    <tbody className="body">
                        {products.map((product) => (
                            <>
                                <tr key={`prod-${product.id_producto}`} className="product-row">
                                    <td className="td">
                                        {product.imagen_url ? (
                                            <img
                                                src={`http://localhost:4000${product.imagen_url}`}
                                                alt={product.nombre}
                                                className="product-image"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image">Sin imagen</div>
                                        )}
                                    </td>
                                    <td className="td font-medium">{product.nombre}</td>
                                    <td className="td">{product.modelo}</td>
                                    <td className="td">${product.precio_base}</td>
                                    <td className="td">
                                        <span className={`status ${product.disponible && product.variantes.some(v => v.stock > 0)
                                            ? 'available'
                                            : 'sold-out'
                                            }`}>
                                            {product.disponible  && product.variantes.some(v => v.stock > 0)
                                                ? 'Disponible'
                                                : 'No Disponible'}
                                        </span>
                                    </td>
                                    <td className="td">
                                        {product.variantes.length} variante(s)
                                    </td>
                                    <td className="td actions">
                                        <button
                                            onClick={() => handleDeleteProduct(product.id_producto)}
                                            className="btn delete"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                    <td className="td actions">
                                        <button
                                            onClick={() => navigate(`/EditProduct/${product.id_producto}`)}
                                            className="btn edit"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                                {product.variantes.map((variant) => (
                                    <tr key={`var-${variant.id_variante}`} className="variant-row">
                                        <td className="td"></td>
                                        <td className="td"></td>
                                        <td className="td"></td>
                                        <td className="td"></td>
                                        <td className="td variant-details" colSpan={2}>
                                            <div className="variant-grid">
                                                <div>
                                                    <span className="label">Talla:</span> {variant.talla}
                                                </div>
                                                <div>
                                                    <span className="label">Color:</span> {variant.color}
                                                </div>
                                                <div>
                                                    <span className="label">Stock:</span> {variant.stock}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="empty">
                        No se encontraron productos en el inventario
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventoryPage;