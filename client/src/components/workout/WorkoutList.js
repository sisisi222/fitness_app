import React from 'react';
import '../../styles/workout/WorkoutList.css';

function WorkoutList({ workouts, onEditRequest, onDeleteRequest }) {
    
    const getExerciseType = (typeId) => {
        switch(typeId) {
            case 1: return 'Aerobic';
            case 2: return 'Cardio';
            case 3: return 'Weight Training';
            default: return 'Unknown';
        }
    };

    // const handleDelete = async (workoutId) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/api/workouts/${workoutId}`, {
    //             method: 'DELETE',
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to delete workout');
    //         }
            
    //         onDeleteRequest(workoutId);
    //     } catch (err) {
    //         console.error("Error:", err.message);
    //     }
    // };

    const handleDelete = async (workoutId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${workoutId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete workout');
            }

            // Safeguard for onDeleteRequest prop
            if (typeof onDeleteRequest === 'function') {
                onDeleteRequest(workoutId);
            } else {
                console.error("onDeleteRequest is not a function. Ensure it is provided as a prop to WorkoutList.");
            }
        } catch (err) {
            console.error("Error:", err.message);
        }
    };

    console.log("All Workouts:", workouts);

    return (
        <div>
            <h2>Workout List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Exercise Type</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workouts.map(workout => {
                        console.log("Individual Workout:", workout);
                        console.log("Details for Workout:", workout.details);
                        return (
                            <tr key={workout.id}>
                                <td>{workout.name}</td>
                                <td>{workout.date}</td>
                                <td>{getExerciseType(workout.exercise_type_id)}</td>
                                <td>
                                    {workout.exercise_type_id === 1 && workout.details?.activity_name && (
                                        <div>
                                            <div>Activity: {workout.details.activity_name}</div>
                                            <div>Duration (hours): {workout.details.duration}</div>
                                            <div>Speed (mph): {workout.details.speed}</div>
                                        </div>
                                    )}
                                    {workout.exercise_type_id === 2 && workout.details?.machine_name && (
                                        <div>
                                            <div>Machine: {workout.details.machine_name}</div>
                                            <div>Time (hours): {workout.details.time_duration}</div>
                                            <div>Distance (miles): {workout.details.distance}</div>
                                        </div>
                                    )}
                                    {workout.exercise_type_id === 3 && workout.details?.exercise_name && (
                                        <div>
                                            <div>Exercise: {workout.details.exercise_name}</div>
                                            <div>Reps: {workout.details.reps}</div>
                                            <div>Sets: {workout.details.sets}</div>
                                            <div>Weight (lb): {workout.details.weight} kg</div>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => onEditRequest(workout.id)}>Edit</button>
                                    <button onClick={() => handleDelete(workout.id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default WorkoutList;
