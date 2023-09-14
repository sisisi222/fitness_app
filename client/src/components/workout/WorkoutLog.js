import React, { useState, useEffect } from 'react';
import AddWorkout from './AddWorkout';
import EditWorkout from './EditWorkout';
import WorkoutList from './WorkoutList';
import '../../styles/workout/WorkoutLog.css'

function WorkoutLog({ userId }) {  // Extract the userId here
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchWorkouts() {
            try {
                const response = await fetch('http://localhost:5000/api/workouts');
                if (!response.ok) {
                    throw new Error('Failed to fetch workouts');
                }
                const data = await response.json();
                setWorkouts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchWorkouts();
    }, []);

    const handleAddSuccess = (newWorkout) => {
        setWorkouts([...workouts, newWorkout]);
    };

    const handleEditSuccess = (updatedWorkout) => {
        const updatedWorkouts = workouts.map(workout =>
            workout.id === updatedWorkout.id ? updatedWorkout : workout
        );
        setWorkouts(updatedWorkouts);
        setSelectedWorkoutId(null); // Close the edit form
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Workout Log</h1>
            
            <AddWorkout onAddSuccess={handleAddSuccess} userId={userId} />

            {selectedWorkoutId ? (
                <EditWorkout
                    workoutId={selectedWorkoutId}
                    userId={userId}
                    onUpdateSuccess={handleEditSuccess}
                />
            ) : null}

            <WorkoutList
                workouts={workouts}
                onEditRequest={setSelectedWorkoutId}
            />
        </div>
    );
}

export default WorkoutLog;
