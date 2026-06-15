import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Login() {
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const username = formData.get('username');
            const password = formData.get('password');
            await login(username, password);
            navigate('/');
        } catch (error) {
            alert('Invalid Credentials!');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Sign in to Learn IT</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id='username' name='username' placeholder='user01' autoComplete='username'/>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' name='password' placeholder='password' autoComplete='current-password'/>
                </div>

                <button type='submit'>Sign In</button>
            </form>
        </div>
    );
}