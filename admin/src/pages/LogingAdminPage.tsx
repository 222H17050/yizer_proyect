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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Acceso Administrativo</h1>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`w-full px-4 py-2 rounded-md border ${formik.touched.email && formik.errors.email
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                } focus:outline-none focus:ring-1`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className={`w-full px-4 py-2 rounded-md border ${formik.touched.password && formik.errors.password
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                } focus:outline-none focus:ring-1`}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                        )}
                    </div>

                   

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${formik.isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                    >
                        {formik.isSubmitting ? 'Verificando...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdminPage;