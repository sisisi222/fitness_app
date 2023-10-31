import React, { useState, useEffect } from 'react';

function DailyFoodLog({ userId }) {
  const [foods, setFoods] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/get_all_foods')
      .then(response => response.json())
      .then(data => setFoods(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    calculateTotalCalories();
  }, [selectedFoods]);

  const handleFoodSelection = () => {
    const food = foods.find(f => f.food_id.toString() === selectedFoodId);
    if (food && quantity) {
      const existingFood = selectedFoods.find(f => f.food_id === food.food_id);
      if (existingFood) {
        existingFood.quantity = parseInt(quantity, 10);
      } else {
        const updatedFoods = [...selectedFoods, { ...food, quantity: parseInt(quantity, 10) }];
        setSelectedFoods(updatedFoods);
      }
    }
  };

  const calculateTotalCalories = () => {
    const total = selectedFoods.reduce((acc, food) => {
      return acc + (food.calories_per_100g * food.quantity) / 100;
    }, 0);
    setTotalCalories(total);
  };

  const saveFoodLog = () => {
    const entries = selectedFoods.map(food => ({
      food_id: food.food_id,
      quantity_g: food.quantity,
      calories_per_100g: food.calories_per_100g
    }));

    fetch('http://localhost:5000/api/log_user_food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: userId, entries: entries })
    })
    .then(response => response.json())
    .then(data => {
      if(data.message === "Entries logged successfully!") {
        alert('Food logged successfully');
        setSelectedFoods([]);
      } else {
        alert('Error logging food');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDoneClick = () => {
    if (selectedFoods.some(food => food.quantity <= 0)) {
      alert('Please ensure all selected food quantities are positive!');
      return;
    }
    saveFoodLog();
  };

  return (
    <div>
      <h2>Select Foods</h2>
      <div>
        <select value={selectedFoodId} onChange={(e) => setSelectedFoodId(e.target.value)}>
          <option value="">Select a Food</option>
          {foods.map(food => (
            <option key={food.food_id} value={food.food_id}>{food.food_name}</option>
          ))}
        </select>
        <input 
          type="number" 
          placeholder="Quantity in grams"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)} 
        />
        <button onClick={handleFoodSelection}>Add Food</button>
      </div>
      <button onClick={handleDoneClick}>Done</button>
      <div>
        <h3>Total Calories for Today</h3>
        {totalCalories.toFixed(2)}
      </div>
      <div>
        <h3>Selected Foods:</h3>
        <ul>
          {selectedFoods.map(food => (
            <li key={food.food_id}>
              {food.food_name} - {food.quantity}g
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DailyFoodLog;
