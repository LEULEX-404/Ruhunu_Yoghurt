import { useState } from 'react';
import { register } from '../api/auth.js';
import '../Css/Register.css';

export default function RegisterPage() {

    const[form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await register(form);
            alert('Registration successful. Please log in.');
            setForm({ name: '', email: '', password: '' });
            window.location.href = '/login';

        }catch (error) {
            alert(error.response.data.message || 'Registration failed');
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Create Account</h2>
            <input className="form-input" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="form-input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="form-input" placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="form-input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="form-button" type="submit">Register</button>
        </form>
    );
}