import React, { useState, useEffect } from 'react';
import '../../styles/workout/WorkoutList.css'

function WorkoutList({ onEditRequest }) {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        // Fetch workouts from backend
        async function fetchData() {
            const response = await fetch('http://localhost:5000/api/workouts'); // Update the URL as needed
            const data = await response.json();
            setWorkouts(data);
        }

        fetchData();
    }, []);

    return (
        <div>
            <h2>Your Workouts</h2>
            <ul>
                {workouts.map(workout => (
                    <li key={workout.id}>
                        <h3>
                            {workout.name} - {workout.date} - {workout.duration} min - {workout.repetitions} reps
                        </h3>
                        <button onClick={() => onEditRequest(workout.id)}>Edit</button>
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default WorkoutList;
