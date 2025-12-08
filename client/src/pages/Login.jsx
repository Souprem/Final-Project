import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const [err, setErr] = useState(null);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            navigate('/');
        } catch (err) {
            setErr(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
            <h1>Login to Buzz</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
                <input className="form-input" type="text" placeholder="Username" name="username" onChange={handleChange} />
                <input className="form-input" type="password" placeholder="Password" name="password" onChange={handleChange} />
                <button className="btn" onClick={handleLogin}>Login</button>
                {err && <p style={{ color: 'red' }}>{err}</p>}
                <span style={{ color: 'gray' }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
