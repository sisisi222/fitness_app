import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeightProgressChart from './WeightProgressChart';

function WeightInputForm({ userId }) {
    const [date, setDate] = useState('');
    const [weightValue, setWeightValue] = useState('');
    const [message, setMessage] = useState('');
    const [existingData, setExistingData] = useState(null);

    useEffect(() => {
        const fetchWeightData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/weight/user/${userId}`);
                if (response.data) {
                    setExistingData(response.data);
                }
                
            } catch (error) {
                console.error("Failed to fetch weight data", error);
            }
        };

        fetchWeightData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/weight', {
                user_id: userId,
                date: date,
                weight_value: weightValue
            });

            setMessage(response.data.message);
            // Update the existing data state with the newly added data
            setExistingData(prevData => [
                ...prevData,
                {
                    date: date,
                    weight_value: weightValue
                }
            ]);

            // Optionally, you can also clear the form fields after successful submission
            setDate('');
            setWeightValue('');
        } catch (error) {
            setMessage('Failed to add weight. Please try again.');
        }
    };

    function formatDate(isoDate) {
        const originalDate = new Date(isoDate);
        const timeZoneOffset = originalDate.getTimezoneOffset() * 60000; // Convert the offset from minutes to milliseconds
        const adjustedDate = new Date(originalDate.getTime() + timeZoneOffset);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return adjustedDate.toLocaleDateString(undefined, options);
    }   
    

    // Sorting data in descending order
    const sortedData = existingData ? [...existingData].sort((a, b) => new Date(b.date) - new Date(a.date)) : null;
    
    return (
        <div className="weight-input-form">
            <h2>Enter Your Weight</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date:</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Weight (in kg):</label>
                    <input 
                        type="number" 
                        value={weightValue}
                        onChange={(e) => setWeightValue(e.target.value)} 
                        step="0.1" 
                        required 
                    />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            
            {sortedData && sortedData.length > 0 ? (
                <div className="existing-data">
                    <h3>Existing Data</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Weight (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((data, index) => (
                                <tr key={index}>
                                    <td>{formatDate(data.date)}</td>
                                    <td>{data.weight_value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No data found. Please input your weight.</p>
            )}

            {sortedData && sortedData.length > 0 && (
                <div className="weight-progress-chart">
                    <h3>Weight Progress Over Time</h3>
                    <WeightProgressChart weightData={sortedData} />
                </div>
            )}
        </div>
    );
}

export default WeightInputForm;
