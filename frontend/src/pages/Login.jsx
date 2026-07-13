import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.username, formData.password);
            navigate('/my-learning');
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto mt-16 max-w-md rounded-lg border border-slate-200 bg-white p-8">
            <h2 className="mb-5 text-center text-2xl font-bold text-slate-900">Welcome Back</h2>
            
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

                <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-3 rounded bg-blue-600 p-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
                Don't have an account? <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">Sign up</Link>
            </p>
        </div>
    );
}
