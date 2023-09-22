import React, { useState, useEffect } from 'react';
import AddWorkout from './AddWorkout';
import EditWorkout from './EditWorkout';
import WorkoutList from './WorkoutList';
import '../../styles/workout/WorkoutLog.css';

function WorkoutLog({ userId }) {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchWorkouts() {
            try {
                const response = await fetch(`http://localhost:5000/api/workouts/user/${userId}`);
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
    }, [userId]);

    const handleAddSuccess = (newWorkout) => {
        setWorkouts([...workouts, newWorkout]);
        console.log("New workout added:", newWorkout);
    };

    const handleEditSuccess = (updatedWorkout) => {
        console.log("Handling Edit with Data:", updatedWorkout);
        const updatedWorkouts = workouts.map(workout =>
            workout.id === updatedWorkout.id ? updatedWorkout : workout
        );
        setWorkouts([...updatedWorkouts]);
    };

    const handleEditRequest = (workoutId) => {
        const workoutToEdit = workouts.find(workout => workout.id === workoutId);
        setSelectedWorkout(workoutToEdit);
    };

    const handleDeleteSuccess = (workoutId) => {
        const remainingWorkouts = workouts.filter(workout => workout.id !== workoutId);
        setWorkouts(remainingWorkouts);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Workout Log</h1>
            
            <AddWorkout onAddSuccess={handleAddSuccess} userId={userId} />

            <WorkoutList
                workouts={workouts}
                onEditRequest={handleEditRequest}
                onDeleteRequest={handleDeleteSuccess} 
            />

            {selectedWorkout && (
                <EditWorkout
                    workout={selectedWorkout}
                    userId={userId}
                    onUpdateSuccess={handleEditSuccess}
                />
            )}
            
        </div>
    );
}

export default WorkoutLog;
