import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GoalSettingForm({ userId }) {
    const [exerciseType, setExerciseType] = useState('');
    const [goalValue, setGoalValue] = useState('');
    const [submittedData, setSubmittedData] = useState(null);
    const [existingGoals, setExistingGoals] = useState([]);
    const [autoContinue, setAutoContinue] = useState(false);
    const [matchingGoal, setMatchingGoal] = useState(null);

    // Removed dateLocal and dateUTC since we are no longer using them.
    
    // Extracted fetching function
    const fetchGoals = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/goals/${userId}?all=true`);
            console.log("Server Response:", response.data);
            setExistingGoals(response.data);
        } catch (error) {
            console.error("Error fetching goals", error);
        }
    };    

    useEffect(() => {
        if (userId) {
            fetchGoals();
        }
        fetchAllGoals();
    }, [userId]);

    const fetchAllGoals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/goals/${userId}');
            console.log("All goals:", response.data);
            setExistingGoals(response.data);
        } catch (error) {
            console.error("Error fetching all goals", error);
        }
    };

    const getExerciseTypeName = (typeId) => {
        // Adjusted the type IDs to be numbers instead of strings.
        switch (parseInt(typeId)) {
            case 1:
                return 'Aerobic';
            case 2:
                return 'Cardio';
            case 3:
                return 'Weight Training';
            default:
                return 'Unknown';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            user_id: userId,
            exercise_type_id: exerciseType,
            goal_metric: exerciseType === "1" ? 'Duration' : 'Sessions',
            goal_value: parseInt(goalValue),
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // a week from today, adjust accordingly,
            auto_continue: autoContinue
        };
    
        const foundMatchingGoal = existingGoals.find(goal => goal.goal_type === exerciseType);
        setMatchingGoal(foundMatchingGoal);
    
        try {
            if (foundMatchingGoal) {
                await axios.put(`http://localhost:5000/api/goals/${matchingGoal.id}`, data);
                alert('Goal updated successfully!');
            } else {
                const response = await axios.post('http://localhost:5000/api/goals', data);
                if (response.status === 201) {
                    // Goal added successfully, update the local state
                    setExistingGoals([...existingGoals, data]);
                    alert('Goal set successfully!');
                }
            }
    
            setSubmittedData(data);
            fetchGoals(); // Refresh goals from the backend
        } catch (error) {
            console.error('Error setting/updating goal', error);
            alert('Failed to set/update goal.');
        }
    };
    
    
    const handleDelete = async (goalId) => {
        try {
            await axios.delete(`http://localhost:5000/api/goals/${goalId}`);
            alert('Goal deleted successfully!');
            fetchGoals();
        } catch (error) {
            console.error('Error deleting goal', error);
            alert('Failed to delete goal.');
        }
    };
    
    const handleAutoContinueToggle = async (goalId) => {
        try {
            const goal = existingGoals.find(g => g.id === goalId);
            const updatedAutoContinueStatus = !goal.auto_continue;
            await axios.put(`http://localhost:5000/api/goals/${goalId}`, {
                auto_continue: updatedAutoContinueStatus
            });
    
            const currentDate = new Date();
            const goalEndDate = new Date(goal.end_date);
    
            // Check if the goal has ended and if auto-continue is set
            if (currentDate > goalEndDate && updatedAutoContinueStatus) {
                const data = {
                    ...goal,
                    start_date: currentDate.toISOString().split('T')[0],
                    end_date: new Date(currentDate.setDate(currentDate.getDate() + 7)).toISOString().split('T')[0]
                };
                await axios.post('http://localhost:5000/api/goals', data);
            }
    
            fetchGoals();  // Refresh goals after toggling auto_continue
        } catch (error) {
            console.error('Error updating auto-continue status', error);
            alert('Failed to update auto-continue status.');
        }
    };
    
    function formatDate(dateString) {
        if (!dateString) {
            return 'Invalid Date';
        }
    
        // Extract the date parts from the dateString
        const match = dateString.match(/(\w{3}), (\d{2}) (\w{3}) (\d{4})/);
        if (!match) {
            return 'Invalid Date';
        }
        
        const [, , day, monthName, year] = match;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.indexOf(monthName);
    
        // Create a new date object from the extracted parts
        const dateObj = new Date(year, monthIndex, day);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    }
    

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
                    type="number"
                    value={goalValue}
                    onChange={e => setGoalValue(e.target.value)}
                    placeholder={exerciseType === "1" ? 'Hours per week' : 'Sessions per week'}
                    required
                />
    
                <label>
                    <input 
                        type="checkbox" 
                        checked={autoContinue} 
                        onChange={() => setAutoContinue(!autoContinue)} 
                    />
                    Auto continue goal to next week
                </label>
    
                <button type="submit">Set Goal</button>
            </form>
    
            {submittedData && (
                <div className="submitted-info">
                    <h3>Submitted Goal:</h3>
                    <p><strong>Exercise Type:</strong> {getExerciseTypeName(submittedData.exercise_type_id)}</p>
                    <p><strong>Goal Metric:</strong> {submittedData.goal_metric}</p>
                    <p><strong>Goal Value:</strong> {submittedData.goal_value} {submittedData.goal_metric === 'Duration' ? 'hours' : 'sessions'}</p>
                    <p><strong>Start Date:</strong> {formatDate(submittedData.start_date)}</p>
                    <p><strong>End Date:</strong> {formatDate(submittedData.end_date)}</p>
                </div>
            )}
        
            <div className="existing-goals">
                <h3>Your Existing Goals</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Exercise Type</th>
                            <th>Goal Metric</th>
                            <th>Goal Value</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {existingGoals.map(goal => (
                            <tr key={goal.id}>
                                <td>{getExerciseTypeName(goal.exercise_type_id)}</td>
                                <td>{goal.goal_metric}</td>
                                <td>{goal.goal_value} {goal.goal_metric === 'Duration' ? 'hours' : 'sessions'}</td>
                                <td>{formatDate(goal.start_date)}</td>
                                <td>{formatDate(goal.end_date)}</td>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={goal.auto_continue} 
                                        onChange={() => handleAutoContinueToggle(goal.id)}
                                    />
                                    Auto-Continue
                                </td>
                                <td><button onClick={() => handleDelete(goal.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="all-goals">
                <h3>All Goals in the Database</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Exercise Type</th>
                            <th>Goal Metric</th>
                            <th>Goal Value</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Auto-Continue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {existingGoals.map(goal => (
                            <tr key={goal.id}>
                                <td>{goal.user_id}</td>
                                <td>{getExerciseTypeName(goal.exercise_type_id)}</td>
                                <td>{goal.goal_metric}</td>
                                <td>{goal.goal_value} {goal.goal_metric === 'Duration' ? 'hours' : 'sessions'}</td>
                                <td>{formatDate(goal.start_date)}</td>
                                <td>{formatDate(goal.end_date)}</td>
                                <td>{goal.auto_continue ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        
    );       
}

export default GoalSettingForm;