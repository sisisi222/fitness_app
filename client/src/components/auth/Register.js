import React, { useState } from 'react';
import '../../styles/auth/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
            username: formData.username,
            password: formData.password
        };

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();

            if (response.status === 200 || response.status === 201) {
                window.alert("Successfully registered!");
            } else {
                window.alert(data.message || "Registration failed.");
                // Assuming your API returns a message on failure.
            }

        } catch (err) {
            window.alert("An error occurred. Please try again.");
            console.error(err.message);
        }
    }

    return (
        <div>
            <h2>Sign Up</h2>
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="firstName" 
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <input 
                    type="tel" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
