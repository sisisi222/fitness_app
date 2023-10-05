import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeasurementProgressChart from './MeasurementProgressChart'; // Assuming you'd have a similar chart for measurements

function MeasurementInputForm({ userId }) {
    const [date, setDate] = useState('');
    const [waist, setWaist] = useState('');
    const [chest, setChest] = useState('');
    const [arms, setArms] = useState('');
    const [legs, setLegs] = useState('');
    const [hip, setHip] = useState('');
    const [message, setMessage] = useState('');
    const [existingData, setExistingData] = useState(null);

    useEffect(() => {
        const fetchMeasurementData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/body_measurements/user/${userId}`);
                if (response.data) {
                    setExistingData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch measurement data", error);
            }
        };

        fetchMeasurementData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/body_measurements', {
                user_id: userId,
                date: date,
                waist: waist,
                chest: chest,
                arms: arms,
                legs: legs,
                hip: hip
            });

            setMessage(response.data.message);
            // Update the existing data state with the newly added data
            setExistingData(prevData => [
                ...prevData,
                {
                    date: date,
                    waist: waist,
                    chest: chest,
                    arms: arms,
                    legs: legs,
                    hip: hip
                }
            ]);

            // Optionally, clear the form fields after successful submission
            setDate('');
            setWaist('');
            setChest('');
            setArms('');
            setLegs('');
            setHip('');
        } catch (error) {
            setMessage('Failed to add measurements. Please try again.');
        }
    };

    function formatDate(isoDate) {
        const originalDate = new Date(isoDate);
        const timeZoneOffset = originalDate.getTimezoneOffset() * 60000; 
        const adjustedDate = new Date(originalDate.getTime() + timeZoneOffset);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return adjustedDate.toLocaleDateString(undefined, options);
    }   

    // Sorting data in descending order
    const sortedData = existingData ? [...existingData].sort((a, b) => new Date(b.date) - new Date(a.date)) : null;

    return (
        <div className="measurement-input-form">
            <h2>Enter Your Measurements</h2>
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
                    <label>Waist (in cm):</label>
                    <input 
                        type="number" 
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)} 
                        step="0.1" 
                        required 
                    />
                </div>
                <div>
                    <label>Chest (in cm):</label>
                    <input 
                        type="number" 
                        value={chest}
                        onChange={(e) => setChest(e.target.value)} 
                        step="0.1" 
                        required 
                    />
                </div>
                <div>
                    <label>Arms (in cm):</label>
                    <input 
                        type="number" 
                        value={arms}
                        onChange={(e) => setArms(e.target.value)} 
                        step="0.1" 
                        required 
                    />
                </div>
                <div>
                    <label>Legs (in cm):</label>
                    <input 
                        type="number" 
                        value={legs}
                        onChange={(e) => setLegs(e.target.value)} 
                        step="0.1" 
                        required 
                    />
                </div>
                <div>
                    <label>Hip (in cm):</label>
                    <input 
                        type="number" 
                        value={hip}
                        onChange={(e) => setHip(e.target.value)} 
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
                    <h3>Existing Measurements</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Waist (cm)</th>
                                <th>Chest (cm)</th>
                                <th>Arms (cm)</th>
                                <th>Legs (cm)</th>
                                <th>Hip (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((data, index) => (
                                <tr key={index}>
                                    <td>{formatDate(data.date)}</td>
                                    <td>{data.waist}</td>
                                    <td>{data.chest}</td>
                                    <td>{data.arms}</td>
                                    <td>{data.legs}</td>
                                    <td>{data.hip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No measurements found. Please input your measurements.</p>
            )}
    
            {sortedData && sortedData.length > 0 && (
                <div className="measurement-progress-chart">
                    <h3>Measurements Progress Over Time</h3>
                    <MeasurementProgressChart measurementData={sortedData} />
                </div>
            )}
        </div>
    );
}

export default MeasurementInputForm;
