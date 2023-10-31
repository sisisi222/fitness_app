import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler, TimeScale } from 'chart.js';

ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler, TimeScale
);

const BMICalculator = ({ userId }) => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBMI] = useState(null);
    const [status, setStatus] = useState('');
    const [bmiRecords, setBmiRecords] = useState([]); // State for storing all BMI records

    useEffect(() => {
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
        setBmiRecords(prevRecords => [...prevRecords, result]);
    };

    const chartData = {
        labels: bmiRecords.map(record => new Date(record.date_recorded).toISOString().split('T')[0]),
        datasets: [{
            label: 'BMI Over Time',
            data: bmiRecords.map(record => record.bmi_value),
            borderColor: '#007BFF',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'blue',
            pointBackgroundColor: '#fff',
            showLine: true
        }]
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM D, YYYY'
                    },
                    tooltipFormat: 'MMM D, YYYY'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'BMI'
                }
            }
        }
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

            <div style={{ width: '1300px', height: '1300px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default BMICalculator;
