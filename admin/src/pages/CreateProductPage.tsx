import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

// Definición de tipos para TypeScript
type Variant = {
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

function ProductsPage() {
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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post('http://localhost:4000/products', {
          ...values,
          disponible: values.disponible ? 1 : 0
        });

        alert(`Producto creado con ID: ${response.data.id}`);
        resetForm();
      } catch (error) {
        alert(`Error al crear el producto: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setSubmitting(false);
      }
    }
  });

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
      <h1 className="form-title">Crear Nuevo Producto</h1>

      <form onSubmit={formik.handleSubmit} className="product-form">
        {/* Campos del formulario */}
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

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="submit-btn"
        >
          {formik.isSubmitting ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}

export default ProductsPage;