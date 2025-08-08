import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const LoginAdminPage = () => {
    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Correo electrónico inválido')
            .required('El correo es requerido'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .required('La contraseña es requerida')
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                const response = await axios.post('http://localhost:4000/admin/verify', {
                    correo: values.email,
                    contraseña: values.password
                });

                if (response.data.success) {
                    // Guardar token y redirigir (aquí deberías usar tu sistema de navegación)
                    localStorage.setItem('adminToken', response.data.token);
                    localStorage.setItem('adminData', JSON.stringify(response.data.data));
                    window.location.href = '/Inventory';
                } else {
                    setErrors({ password: 'Credenciales incorrectas' });
                }
            } catch (error) {
                setErrors({ password: 'Error al conectar con el servidor' });
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="login-container">
            <div className="card form-container">
                <h1 className="login-title">Acceso Administrativo</h1>

                <form onSubmit={formik.handleSubmit} className="product-form">
                    <div className="form-field">
                        <label htmlFor="email" className="form-label">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`form-input ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="form-error">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className={`form-input ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="form-error">{formik.errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={`submit-btn ${formik.isSubmitting ? 'submit-btn-disabled' : ''}`}
                    >
                        {formik.isSubmitting ? 'Verificando...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdminPage;
