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
    const [goals, setGoals] = useState([]);

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

        async function fetchGoals() {
            try {
                const response = await fetch(`http://localhost:5000/api/goals/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch goals');
                }
                const data = await response.json();
                setGoals(data);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchWorkouts();
        fetchGoals();
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
        setSelectedWorkout(null); //Hide the edit table after sucessfully edit
    };

    const handleEditRequest = (workoutId) => {
        const workoutToEdit = workouts.find(workout => workout.id === workoutId);
        setSelectedWorkout(workoutToEdit);
    };

    const handleDeleteSuccess = (workoutId) => {
        const remainingWorkouts = workouts.filter(workout => workout.id !== workoutId);
        setWorkouts(remainingWorkouts);
    };

    function calculateProgress() {
        const progress = {};
    
        // For Aerobic: Sum durations
        const totalAerobicDuration = workouts
            .filter(workout => workout.exercise_type_id === 1)
            .reduce((sum, workout) => sum + (workout.details?.duration || 0), 0);
        progress.aerobic = totalAerobicDuration;
    
        // For Cardio: Count sessions
        const totalCardioSessions = workouts
            .filter(workout => workout.exercise_type_id === 2)
            .length;
        progress.cardio = totalCardioSessions;
    
        // For Weight Training: Count sessions
        const totalWeightTrainingSessions = workouts
            .filter(workout => workout.exercise_type_id === 3)
            .length;
        progress.weightTraining = totalWeightTrainingSessions;
    
        return progress;
    }
    
    const progress = calculateProgress();    

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

            <div>
                <h2>Your Progress:</h2>
                <table className="progress-table">
                    <thead>
                        <tr>
                            <th>Exercise Type</th>
                            <th>Progress</th>
                            <th>Goal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.find(goal => goal.exercise_type_id === 1) && (
                            <tr>
                                <td>Aerobic</td>
                                <td>{progress.aerobic} hours this week</td>
                                <td>{goals.find(goal => goal.exercise_type_id === 1)?.goal_value || 0} hours</td>
                            </tr>
                        )}
                        {goals.find(goal => goal.exercise_type_id === 2) && (
                            <tr>
                                <td>Cardio</td>
                                <td>{progress.cardio} sessions this week</td>
                                <td>{goals.find(goal => goal.exercise_type_id === 2)?.goal_value || 0} sessions</td>
                            </tr>
                        )}
                        {goals.find(goal => goal.exercise_type_id === 3) && (
                            <tr>
                                <td>Weight Training</td>
                                <td>{progress.weightTraining} sessions this week</td>
                                <td>{goals.find(goal => goal.exercise_type_id === 3)?.goal_value || 0} sessions</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WorkoutLog;
