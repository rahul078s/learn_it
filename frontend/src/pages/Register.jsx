import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Use it to login automatically after a user register.

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            await api.post('/users/api/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password_confirm: formData.confirmPassword
            });

            await login(formData.username, formData.password);

            navigate('/courses');
        } catch (err) {
            console.error("Registration failed: ", err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.username?.[0] || "Registration failed. Please try again.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto mt-16 max-w-md rounded-lg border border-slate-200 bg-white p-8">
            <h2 className="mb-5 text-center text-2xl font-bold text-slate-900">Create an Account</h2>

            {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="mb-1 block text-sm font-bold text-slate-900">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold text-slate-900">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        // required
                        className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold text-slate-900">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold text-slate-900">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 rounded bg-blue-600 p-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Log in</Link>
            </p>
        </div>
    );
}
