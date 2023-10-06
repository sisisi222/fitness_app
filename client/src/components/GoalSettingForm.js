import React, { useState } from 'react';
import axios from 'axios';

function GoalSettingForm({ userId }) {
    const [exerciseType, setExerciseType] = useState(null);
    const [goalValue, setGoalValue] = useState('');
    const [submittedData, setSubmittedData] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            user_id: userId,
            exercise_type_id: exerciseType,
            goal_metric: exerciseType === 1 ? 'Duration' : 'Sessions',
            goal_value: goalValue,
            start_date: new Date().toISOString().split('T')[0], // starting today, for simplicity
            end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0] // a week from today, adjust accordingly
        };

        try {
            await axios.post('http://localhost:5000/api/goals', data);
            setSubmittedData(data); 
            alert('Goal set successfully!');
        } catch (error) {
            console.error('Error setting goal', error);
            alert('Failed to set goal.');
        }
    };

    return (
        <div>
            <h2>Let's Add Your Goal</h2>
            <p>Example Instruction:</p>
            <ul>
                <li>Aerobic: "I want to run/jog/walk/cycle for 5 hours this week."</li>
                <li>Cardio: "I want to do 3 cardio sessions this week."</li>
                <li>Weight Training: "I want to do 4 weight training sessions this week."</li>
            </ul>
            
            <form onSubmit={handleSubmit}>
                <select value={exerciseType} onChange={e => setExerciseType(e.target.value)} required>
                    <option value="" disabled>Select exercise type</option>
                    <option value="1">Aerobic</option>
                    <option value="2">Cardio</option>
                    <option value="3">Weight Training</option>
                </select>
                
                <input
                    type={exerciseType === 1 ? 'number' : 'number'}
                    value={goalValue}
                    onChange={e => setGoalValue(e.target.value)}
                    placeholder={exerciseType === 1 ? 'Hours per week' : 'Sessions per week'}
                    required
                />
                
                <button type="submit">Set Goal</button>
            </form>

            {submittedData && (
            <div className="submitted-info">
                <h3>Submitted Goal:</h3>
                <p><strong>Exercise Type:</strong> {submittedData.exercise_type_id === "1" ? 'Aerobic' : submittedData.exercise_type_id === "2" ? 'Cardio' : 'Weight Training'}</p>
                <p><strong>Goal Metric:</strong> {submittedData.goal_metric}</p>
                <p><strong>Goal Value:</strong> {submittedData.goal_value} {submittedData.goal_metric === 'Duration' ? 'hours' : 'sessions'}</p>
                <p><strong>Start Date:</strong> {submittedData.start_date}</p>
                <p><strong>End Date:</strong> {submittedData.end_date}</p>
            </div>
             )}

        </div>
    );
}

export default GoalSettingForm;