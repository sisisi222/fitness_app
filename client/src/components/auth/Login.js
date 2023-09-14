import React, { useState } from 'react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate(); // Add the useNavigate hook

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that all fields are filled out
        if (!username || !password) {
            setError('Please enter your username and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message and clear form
                alert('Login successful!');
                setUser({ cid: data.id }); // Store the customer ID in the UserContext
                setUsername('');
                setPassword('');
                setError('');
                
                navigate('/'); // Redirect to the home page

            } else {
                // Show error message
                setError(data.error);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
