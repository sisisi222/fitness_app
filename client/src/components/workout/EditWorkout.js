import React, { useState, useEffect } from 'react';
import '../../styles/workout/EditWorkout.css';

function EditWorkout({ workout, userId, onUpdateSuccess }) {
    // Base workout fields with default initialization
    const [editedWorkout, setEditedWorkout] = useState({
        ...workout,
        name: workout.name || '',
        date: workout.date || new Date().toISOString().substr(0, 10),
        exercise_type_id: workout.exercise_type_id || 1, // Defaulting to 'Aerobic' as an example
        activity_name: workout.activity_name || '',
        duration: workout.duration || 0,
        speed: workout.speed || 0,
        machine_name: workout.machine_name || '',
        time_duration: workout.time_duration || 0,
        distance: workout.distance || 0,
        exercise_name: workout.exercise_name || '',
        reps: workout.reps || 0,
        sets: workout.sets || 0,
        weight: workout.weight || 0
    });

    const handleChange = (field) => (event) => {
        setEditedWorkout(prevState => ({
            ...prevState,
            [field]: event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${workout.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedWorkout),
            });

            if (!response.ok) {
                throw new Error('Failed to update workout.');
            }

            const updatedWorkout = await response.json();
            console.log("Updated Workout from Server:", updatedWorkout);

            if (updatedWorkout.id) {
                onUpdateSuccess(updatedWorkout);
            } else {
                console.error("API response is not as expected or workout update failed.");
            }

        } catch (error) {
            console.error('Error updating workout:', error);
        }
    };

    const handleExerciseTypeChange = (event) => {
        const newExerciseTypeId = parseInt(event.target.value, 10);
        let resetDetails = {};
    
        switch (newExerciseTypeId) {
            case 1: // Aerobic
                resetDetails = {
                    activity_name: '',
                    duration: 0,
                    speed: 0,
                };
                break;
            case 2: // Cardio
                resetDetails = {
                    machine_name: '',
                    time_duration: 0,
                    distance: 0,
                };
                break;
            case 3: // WeightTraining
                resetDetails = {
                    exercise_name: '',
                    reps: 0,
                    sets: 0,
                    weight: 0,
                };
                break;
            default:
                console.error("Unknown exercise type ID!");
        }
    
        setEditedWorkout(prevState => ({
            ...prevState,
            ...resetDetails,
            exercise_type_id: newExerciseTypeId,
        }));
    };
    
    return (
        <div>
            <h2>Edit Workout</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={editedWorkout.name} onChange={handleChange('name')} />
                </label>
                
                <label>
                    Date:
                    <input type="date" value={editedWorkout.date} onChange={handleChange('date')} />
                </label>
    
                <label>
                    Exercise Type:
                    <select value={editedWorkout.exercise_type_id} onChange={handleExerciseTypeChange}>
                        <option value="1">Aerobic</option>
                        <option value="2">Cardio</option>
                        <option value="3">Weight Training</option>
                    </select>
                </label>
    
                {editedWorkout.exercise_type_id == 1 && (
                    <>
                        <label>
                            Activity Name:
                            <input type="text" value={editedWorkout.activity_name} onChange={handleChange('activity_name')} />
                        </label>
                        <label>
                            Duration:
                            <input type="number" value={editedWorkout.duration} onChange={handleChange('duration')} />
                        </label>
                        <label>
                            Speed:
                            <input type="number" value={editedWorkout.speed} onChange={handleChange('speed')} step="0.1" />
                        </label>
                    </>
                )}
    
                {editedWorkout.exercise_type_id == 2 && (
                    <>
                        <label>
                            Machine Name:
                            <input type="text" value={editedWorkout.machine_name} onChange={handleChange('machine_name')} />
                        </label>
                        <label>
                            Time Duration:
                            <input type="number" value={editedWorkout.time_duration} onChange={handleChange('time_duration')} />
                        </label>
                        <label>
                            Distance:
                            <input type="number" value={editedWorkout.distance} onChange={handleChange('distance')} step="0.1" />
                        </label>
                    </>
                )}
    
                {editedWorkout.exercise_type_id == 3 && (
                    <>
                        <label>
                            Exercise Name:
                            <input type="text" value={editedWorkout.exercise_name} onChange={handleChange('exercise_name')} />
                        </label>
                        <label>
                            Reps:
                            <input type="number" value={editedWorkout.reps} onChange={handleChange('reps')} />
                        </label>
                        <label>
                            Sets:
                            <input type="number" value={editedWorkout.sets} onChange={handleChange('sets')} />
                        </label>
                        <label>
                            Weight (in kg):
                            <input type="number" value={editedWorkout.weight} onChange={handleChange('weight')} step="0.1" />
                        </label>
                    </>
                )}
    
                <button type="submit">Update Workout</button>
            </form>
        </div>
    );    
}

export default EditWorkout;
