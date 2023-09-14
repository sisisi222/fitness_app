import React, { useState } from 'react';

function AddWorkout({ userId, onAddSuccess }) {  // Accept userId as a prop
    const [workoutData, setWorkoutData] = useState({
        name: '',
        date: '',
        duration: '',
        repetitions: '',
        user_id: userId ? userId : null  // Use userId from the prop
    });

    const handleChange = e => {
        setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!workoutData.user_id) {
            console.error("No user ID available");
            return;
        }

        console.log("Sending data:", workoutData);
        
        try {
            const response = await fetch('http://localhost:5000/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData)
            });

            if (!response.ok) {
                throw new Error(`Failed to add workout. Status: ${response.status}`);
            }
            
            const responseData = await response.json();
            console.log("Response:", responseData);
            
            onAddSuccess(responseData);  // Call the onAddSuccess callback with the new workout

            setWorkoutData({
                name: '',
                date: '',
                duration: '',
                repetitions: '',
                user_id: userId ? userId : null  // Reset with userId from the prop
            });

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
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
            <button type="submit">Add Workout</button>
        </form>
    );
}

export default AddWorkout;
