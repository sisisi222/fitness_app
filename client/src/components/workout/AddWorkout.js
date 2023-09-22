import React, { useState } from 'react';
import '../../styles/workout/AddWorkout.css';

function AddWorkout({ onAddSuccess, userId }) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [exercise_type_id, setExerciseTypeId] = useState(1);

    // Aerobic fields
    const [activity_name, setActivityName] = useState('');
    const [duration, setDuration] = useState('');
    const [speed, setSpeed] = useState('');

    // Cardio fields
    const [machine_name, setMachineName] = useState('');
    const [time_duration, setTimeDuration] = useState('');
    const [distance, setDistance] = useState('');

    // Weight Training fields
    const [exercise_name, setExerciseName] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [weight, setWeight] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let exerciseDetails = {}; 

        if (exercise_type_id === 1) { // Aerobic
            exerciseDetails = {
                activity_name,
                duration,
                speed
            };
        } else if (exercise_type_id === 2) { // Cardio
            exerciseDetails = {
                machine_name,
                time_duration,
                distance
            };
        } else if (exercise_type_id === 3) { // Weight Training
            exerciseDetails = {
                exercise_name,
                reps,
                sets,
                weight
            };
        }
    
        const workoutData = {
            name,
            date,
            user_id: userId,
            exercise_type_id,
            exercise_details: exerciseDetails
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workoutData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to add workout');
            }
    
            const data = await response.json();
            console.log("API Response:", data);
    
            if (data.message) {
                onAddSuccess(data.workout);
            } else {
                console.error("API response is not as expected or workout addition failed.");
            }
        
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    return (
        <div>
            <h2>Add New Workout</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Date:
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </label>
                <label>
                    Exercise Type:
                    <select value={exercise_type_id} onChange={e => setExerciseTypeId(parseInt(e.target.value, 10))}>
                        <option value="1">Aerobic</option>
                        <option value="2">Cardio</option>
                        <option value="3">Weight Training</option>
                    </select>
                </label>

                {exercise_type_id === 1 && (
                    <>
                        <label>
                            Activity Name:
                            <input type="text" value={activity_name} onChange={e => setActivityName(e.target.value)} />
                        </label>
                        <label>
                            Duration (minutes):
                            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                        </label>
                        <label>
                            Speed (mph):
                            <input type="number" value={speed} onChange={e => setSpeed(e.target.value)} step="0.1" />
                        </label>
                    </>
                )}
                {exercise_type_id === 2 && (
                    <>
                        <label>
                            Machine Name:
                            <input type="text" value={machine_name} onChange={e => setMachineName(e.target.value)} />
                        </label>
                        <label>
                            Time Duration (minutes):
                            <input type="number" value={time_duration} onChange={e => setTimeDuration(e.target.value)} />
                        </label>
                        <label>
                            Distance (miles):
                            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} step="0.1" />
                        </label>
                    </>
                )}
                {exercise_type_id === 3 && (
                    <>
                        <label>
                            Exercise Name:
                            <input type="text" value={exercise_name} onChange={e => setExerciseName(e.target.value)} />
                        </label>
                        <label>
                            Reps:
                            <input type="number" value={reps} onChange={e => setReps(e.target.value)} />
                        </label>
                        <label>
                            Sets:
                            <input type="number" value={sets} onChange={e => setSets(e.target.value)} />
                        </label>
                        <label>
                            Weight (lb):
                            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" />
                        </label>
                    </>
                )}
                <button type="submit">Add Workout</button>
            </form>
        </div>
    );
}

export default AddWorkout;
