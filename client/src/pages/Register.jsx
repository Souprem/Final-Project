import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Register = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
        role: 'member', // default
    });
    const [err, setErr] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', inputs);
            navigate('/login');
        } catch (err) {
            setErr(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
            <h1>Join Buzz</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
                <input className="form-input" type="text" placeholder="Username" name="username" onChange={handleChange} />
                <input className="form-input" type="password" placeholder="Password" name="password" onChange={handleChange} />
                <select className="form-input" name="role" onChange={handleChange}>
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                </select>
                <button className="btn" onClick={handleRegister}>Register</button>
                {err && <p style={{ color: 'red' }}>{err}</p>}
                <span style={{ color: 'gray' }}>
                    Have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;
