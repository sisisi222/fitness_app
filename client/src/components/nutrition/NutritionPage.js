import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BMICalculator = ({ userId }) => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBMI] = useState(null);
    const [status, setStatus] = useState('');
    const [bmiRecords, setBmiRecords] = useState([]); // New state for storing all BMI records

    useEffect(() => {
        // Fetch existing BMI data when the component is mounted
        const fetchBmiData = async () => {
            const response = await axios.get(`http://localhost:5000/api/get_bmi_by_user/${userId}`);
            setBmiRecords(response.data);
        };

        fetchBmiData();
    }, [userId]);

    const calculateBMI = async () => {
        const response = await axios.post('http://localhost:5000/api/add_bmi_lbs_in', {
            user_id: userId,
            weight_lbs: weight,
            height_in: height
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;
        setBMI(result.bmi_value);
        setStatus(result.bmi_status);
        setBmiRecords(prevRecords => [...prevRecords, result]); // Add new record to the list
    };

    return (
        <div>
            <h2>BMI Calculator</h2>
            <div>
                <label>Weight (lbs): </label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
                <label>Height (inches): </label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <button onClick={calculateBMI}>Calculate</button>

            {bmi && (
                <div>
                    <p>Your BMI: {bmi}</p>
                    <p>Status: {status}</p>
                </div>
            )}

            <h3>Your BMI Records:</h3>
            <ul>
                {bmiRecords.map(record => (
                    <li key={record.id}>
                        Date: {new Date(record.date_recorded).toISOString().split('T')[0]}, 
                        BMI: {record.bmi_value.toFixed(2)}, 
                        Status: {record.bmi_status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BMICalculator;
