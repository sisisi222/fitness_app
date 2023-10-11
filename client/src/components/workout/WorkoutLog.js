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
    const [progress, setProgress] = useState({
        aerobic: 0,
        cardio: 0,
        weightTraining: 0,
    });
    const [completion, setCompletion] = useState({
        aerobic: 0,
        cardio: 0,
        weightTraining: 0,
    });

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
        fetchProgress();
        fetchCompletion();
    }, [userId]);

    const handleAddSuccess = (newWorkout) => {
        setWorkouts([...workouts, newWorkout]);
        console.log("New workout added:", newWorkout);
        fetchProgress();
        fetchCompletion();
    };

    const handleEditSuccess = (updatedWorkout) => {
        console.log("Handling Edit with Data:", updatedWorkout);
        const updatedWorkouts = workouts.map(workout =>
            workout.id === updatedWorkout.id ? updatedWorkout : workout
        );
        setWorkouts([...updatedWorkouts]);
        setSelectedWorkout(null); //Hide the edit table after sucessfully edit
        fetchProgress();
        fetchCompletion();
    };

    const handleEditRequest = (workoutId) => {
        const workoutToEdit = workouts.find(workout => workout.id === workoutId);
        setSelectedWorkout(workoutToEdit);
    };

    const handleDeleteSuccess = (workoutId) => {
        const remainingWorkouts = workouts.filter(workout => workout.id !== workoutId);
        setWorkouts(remainingWorkouts);
        fetchProgress();
        fetchCompletion();
    };

    async function fetchProgress() {
        try {
            const response = await fetch(`http://localhost:5000/api/progress/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch progress');
            }
            const data = await response.json();
            setProgress({
                aerobic: data.aerobic_duration,
                cardio: data.cardio_sessions,
                weightTraining: data.weight_sessions,
            });
        } catch (err) {
            setError(err.message);
        }
        
    } 

    async function fetchCompletion() {
        try {
            const response = await fetch(`http://localhost:5000/api/completion/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch completion');
            }
            const data = await response.json();
            setCompletion({
                aerobic: data.aerobic_completion,
                cardio: data.cardio_completion,
                weightTraining: data.weight_completion,
            });
        } catch (err) {
            setError(err.message);
        }
    }

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
                        <tr>
                            <td>Aerobic</td>
                            <td>{progress.aerobic} hours completed</td>
                            <td>{completion.aerobic}%</td>
                            <td>{goals.find(goal => goal.exercise_type_id === 1)?.goal_value || 0} hours</td>
                        </tr>
                        <tr>
                            <td>Cardio</td>
                            <td>{progress.cardio} sessions completed</td>
                            <td>{completion.cardio}%</td>
                            <td>{goals.find(goal => goal.exercise_type_id === 2)?.goal_value || 0} sessions</td>
                        </tr>
                        <tr>
                            <td>Weight Training</td>
                            <td>{progress.weightTraining} sessions completed</td>
                            <td>{completion.weightTraining}%</td>
                            <td>{goals.find(goal => goal.exercise_type_id === 3)?.goal_value || 0} sessions</td>
                        </tr>
                    </tbody>
                </table>
            </div>



        </div>
    );
}

export default WorkoutLog;