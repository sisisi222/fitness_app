import React, { useState, useEffect } from 'react';
import '../../styles/workout/EditWorkout.css'

function EditWorkout({ workoutId, userId, onUpdateSuccess }) {
    const [workoutData, setWorkoutData] = useState({
        name: '',
        date: '',
        duration: '',
        repetitions: '',
        user_id: userId ? userId : null  // Use userId from the prop
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:5000/api/workouts/${workoutId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch workout details');
                }
                const data = await response.json();
                setWorkoutData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, [workoutId]);

    const handleChange = e => {
        setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${workoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workoutData)
            });

            if (!response.ok) {
                throw new Error('Failed to update workout');
            }

            const updatedWorkout = await response.json();
            if (onUpdateSuccess) {
                onUpdateSuccess(updatedWorkout);
            }

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Edit Workout</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Exercise Name" 
                    value={workoutData.name}
                    onChange={handleChange}
                />
                <input 
                    type="date" 
                    name="date" 
                    value={workoutData.date}
                    onChange={handleChange}
                />
                <input 
                    type="number" 
                    name="duration" 
                    placeholder="Duration (in minutes)"
                    value={workoutData.duration}
                    onChange={handleChange}
                />
                <input 
                    type="number" 
                    name="repetitions" 
                    placeholder="Repetitions"
                    value={workoutData.repetitions}
                    onChange={handleChange}
                />
                <button type="submit">Update Workout</button>
            </form>
        </div>
    );
}

export default EditWorkout;
