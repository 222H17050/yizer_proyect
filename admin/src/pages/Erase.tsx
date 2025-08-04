import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';

type Variant = {
    id_variante?: number;
    talla: string;
    color: string;
    stock: string;
};

type FormValues = {
    nombre: string;
    modelo: string;
    tipo: string;
    descripcion: string;
    precio_base: string;
    disponible: boolean;
    variantes: Variant[];
};

function EditProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const productSchema = Yup.object().shape({
        nombre: Yup.string().required('El nombre es requerido'),
        modelo: Yup.string().required('El modelo es requerido'),
        tipo: Yup.string().required('Selecciona un tipo').oneOf(['estandar', 'perzonalizable']),
        descripcion: Yup.string().required('La descripción es requerida'),
        precio_base: Yup.number()
            .required('El precio es requerido')
            .positive('El precio debe ser positivo'),
        disponible: Yup.boolean().required('Debes especificar la disponibilidad'),
        variantes: Yup.array().of(
            Yup.object().shape({
                talla: Yup.string().required('Talla requerida'),
                color: Yup.string().required('Color requerido'),
                stock: Yup.number().positive('Stock debe ser positivo').required('Stock requerido')
            })
        ).min(1, 'Debe haber al menos una variante')
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setPreviewImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const formik = useFormik<FormValues>({
        initialValues: {
            nombre: '',
            modelo: '',
            tipo: 'estandar',
            descripcion: '',
            precio_base: '',
            disponible: true,
            variantes: [{ talla: '', color: '', stock: '' }]
        },
        validationSchema: productSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const formData = new FormData();

                // Agregar campos normales
                formData.append('nombre', values.nombre);
                formData.append('modelo', values.modelo);
                formData.append('tipo', values.tipo);
                formData.append('descripcion', values.descripcion);
                formData.append('precio_base', values.precio_base);
                formData.append('disponible', values.disponible ? '1' : '0');

                // Agregar variantes como JSON
                formData.append('variantes', JSON.stringify(values.variantes.map(v => ({
                    ...v,
                    id_variante: v.id_variante || undefined
                })));

                // Agregar archivo si existe
                if (selectedFile) {
                    formData.append('image', selectedFile);
                }

                const response = await axios.put(
                    `http://localhost:4000/products/${id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                alert('Producto actualizado correctamente');
                navigate('/inventory');
            } catch (error) {
                console.error('Error completo:', error);
                alert(`Error al actualizar el producto: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/products/${id}`);
                const productData = response.data;

                setCurrentImage(productData.imagen_url ?
                    `http://localhost:4000${productData.imagen_url}` : null);

                formik.setValues({
                    nombre: productData.nombre,
                    modelo: productData.modelo,
                    tipo: productData.tipo,
                    descripcion: productData.descripcion,
                    precio_base: productData.precio_base.toString(),
                    disponible: Boolean(productData.disponible),
                    variantes: productData.variantes.map((v: any) => ({
                        id_variante: v.id_variante,
                        talla: v.talla,
                        color: v.color,
                        stock: v.stock.toString()
                    }))
                });
            } catch (error) {
                console.error('Error cargando producto:', error);
                alert('No se pudo cargar el producto para editar');
                navigate('/inventory');
            }
        };

        loadProduct();
    }, [id]);

    const addVariant = () => {
        formik.setFieldValue('variantes', [
            ...formik.values.variantes,
            { talla: '', color: '', stock: '' }
        ]);
    };

    const removeVariant = (index: number) => {
        const newVariants = [...formik.values.variantes];
        newVariants.splice(index, 1);
        formik.setFieldValue('variantes', newVariants);
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Editar Producto</h1>
            <form onSubmit={formik.handleSubmit} className="product-form">
                {/* Campo para subir imagen */}
                <div className="form-field">
                    <label htmlFor="image" className="form-label">Imagen del Producto:</label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-input"
                    />
                    {(previewImage || currentImage) && (
                        <div className="image-preview">
                            <img
                                src={previewImage || currentImage || ''}
                                alt="Vista previa"
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '200px',
                                    marginTop: '10px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Resto de campos del formulario (igual que antes) */}
 <div className="form-field">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nombre}
                        className="form-input"
                    />
                    {formik.touched.nombre && formik.errors.nombre && (
                        <div className="form-error">{formik.errors.nombre}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="modelo" className="form-label">Modelo:</label>
                    <input
                        id="modelo"
                        name="modelo"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.modelo}
                        className="form-input"
                    />
                    {formik.touched.modelo && formik.errors.modelo && (
                        <div className="form-error">{formik.errors.modelo}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="tipo" className="form-label">Tipo:</label>
                    <select
                        id="tipo"
                        name="tipo"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tipo}
                        className="form-input"
                    >
                        <option value="estandar">Estándar</option>
                        <option value="perzonalizable">Personalizable</option>
                    </select>
                    {formik.touched.tipo && formik.errors.tipo && (
                        <div className="form-error">{formik.errors.tipo}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="descripcion" className="form-label">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.descripcion}
                        className="form-input form-textarea"
                    />
                    {formik.touched.descripcion && formik.errors.descripcion && (
                        <div className="form-error">{formik.errors.descripcion}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="precio_base" className="form-label">Precio Base:</label>
                    <input
                        id="precio_base"
                        name="precio_base"
                        type="number"
                        step="0.01"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.precio_base}
                        className="form-input"
                    />
                    {formik.touched.precio_base && formik.errors.precio_base && (
                        <div className="form-error">{formik.errors.precio_base}</div>
                    )}
                </div>

                <div className="form-field form-toggle">
                    <label htmlFor="disponible" className="form-label">Disponible:</label>
                    <label className="toggle-switch">
                        <input
                            id="disponible"
                            name="disponible"
                            type="checkbox"
                            checked={formik.values.disponible}
                            onChange={() => formik.setFieldValue('disponible', !formik.values.disponible)}
                            className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">
                            {formik.values.disponible ? 'Sí' : 'No'}
                        </span>
                    </label>
                </div>

                {/* Sección de Variantes */}
                <div className="variants-section">
                    <h2 className="variants-title">Variantes</h2>

                    {formik.values.variantes.map((variant, index) => (
                        <div key={index} className="variant-card">
                            <div className="variant-header">
                                <h3 className="variant-number">Variante #{index + 1}</h3>
                                {formik.values.variantes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="variant-remove-btn"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>

                            <div className="variant-field">
                                <label htmlFor={`variantes.${index}.talla`} className="variant-label">Talla:</label>
                                <input
                                    id={`variantes.${index}.talla`}
                                    name={`variantes.${index}.talla`}
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={variant.talla}
                                    className="variant-input"
                                />
                                {formik.touched.variantes?.[index]?.talla && formik.errors.variantes?.[index]?.talla && (
                                    <div className="variant-error">{formik.errors.variantes[index]?.talla}</div>
                                )}
                            </div>

                            <div className="variant-field">
                                <label htmlFor={`variantes.${index}.color`} className="variant-label">Color:</label>
                                <input
                                    id={`variantes.${index}.color`}
                                    name={`variantes.${index}.color`}
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={variant.color}
                                    className="variant-input"
                                />
                                {formik.touched.variantes?.[index]?.color && formik.errors.variantes?.[index]?.color && (
                                    <div className="variant-error">{formik.errors.variantes[index]?.color}</div>
                                )}
                            </div>

                            <div className="variant-field">
                                <label htmlFor={`variantes.${index}.stock`} className="variant-label">Stock:</label>
                                <input
                                    id={`variantes.${index}.stock`}
                                    name={`variantes.${index}.stock`}
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={variant.stock}
                                    className="variant-input"
                                />
                                {formik.touched.variantes?.[index]?.stock && formik.errors.variantes?.[index]?.stock && (
                                    <div className="variant-error">{formik.errors.variantes[index]?.stock}</div>
                                )}
                            </div>

                            {/* Repetir para color y stock */}
                            {/* ... */}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addVariant}
                        className="add-variant-btn"
                    >
                        + Agregar otra variante
                    </button>
                </div>


                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="submit-btn"
                    >
                        {formik.isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/inventory')}
                        className="cancel-btn"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProductPage;