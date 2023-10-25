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

    const useFetch = (url, defaultResponse) => {
        const [data, setData] = useState(defaultResponse);
        const [error, setError] = useState(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            async function fetchData() {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }

            fetchData();
        }, [url]);

        return { data, error, isLoading };
    };

    const workoutsResponse = useFetch(`http://localhost:5000/api/workouts/user/${userId}`, []);
    const goalsResponse = useFetch(`http://localhost:5000/api/goals/${userId}`, []);
    const progressResponse = useFetch(`http://localhost:5000/api/progress/${userId}`, {});
    const completionResponse = useFetch(`http://localhost:5000/api/completion/${userId}`, {});

    const isLoading = workoutsResponse.isLoading || goalsResponse.isLoading || progressResponse.isLoading || completionResponse.isLoading;

    const isError = workoutsResponse.error || goalsResponse.error || progressResponse.error || completionResponse.error;


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
                workouts={workoutsResponse.data}
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
                            <th>Completion</th>
                            <th>Goal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Aerobic</td>
                            <td>{progressResponse.data.aerobic} hours completed</td>
                            <td>{completionResponse.data.aerobic}%</td>
                            <td>{goalsResponse.data.find(goal => goal.exercise_type_id === 1)?.goal_value || 0} hours</td>
                        </tr>
                        <tr>
                            <td>Cardio</td>
                            <td>{progressResponse.data.cardio} sessions completed</td>
                            <td>{completionResponse.data.cardio}%</td>
                            <td>{goalsResponse.data.find(goal => goal.exercise_type_id === 2)?.goal_value || 0} sessions</td>
                        </tr>
                        <tr>
                            <td>Weight Training</td>
                            <td>{progressResponse.data.weightTraining} sessions completed</td>
                            <td>{completionResponse.data.weightTraining}%</td>
                            <td>{goalsResponse.data.find(goal => goal.exercise_type_id === 3)?.goal_value || 0} sessions</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WorkoutLog;







