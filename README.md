# Fitness Tracker Website

Welcome to the Fitness Tracker website! This is one of my personal projects. This web application is designed to help users track their fitness progress, set personalized goals, and achieve a healthier lifestyle. It incorporates a range of features to enhance the fitness journey of its users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

## Features

### Core Functionalities

1. **User Registration and Authentication**
   - Users can create accounts and log in securely.
   - Passwords are hashed and stored securely.

2. **Manual Workout Logging**
   - Users can log their workouts, including exercise details, duration, and date.

3. **Visual Progress Tracking**
   - Users can view their fitness progress through graphs and charts.
   - Track metrics such as weight, body measurements, and workout history.

4. **Personalized Goal Setting**
   - Users can set fitness goals and track their progress towards achieving them.

### Additional Features 

5. **Virtual Personal Trainer**
   - Incorporate a virtual personal trainer feature to provide workout recommendations and tips.

6. **Achievements and Badges System**
   - Implement a system that rewards users with achievements and badges based on their fitness milestones and accomplishments.

7. **Nutritional Tracking**
   - Add the ability for users to track their daily nutritional intake, including calories, macronutrients, and micronutrients.

8. **User Profile**
   - User are welcome to upload avatar picture and post status

   <img width="1366" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/ad38c43e-422d-4afe-a21f-b3516349d2a4">

## Technologies Used

- **Backend**: Flask
- **Frontend**: React
- **Database**: PostgreSQL
- **Cloud Hosting**: AWS (Amazon Web Services)

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository to your local machine.

```bash
git clone https://github.com/yourusername/fitness-tracker.git
```

2. Install the necessary dependencies for both the backend (Flask) and frontend (React).

```bash
# Navigate to the backend directory
cd backend
pip install -r requirements.txt

# Navigate to the frontend directory
cd ../frontend
npm install
```

3. Set up the PostgreSQL database and configure the database connection in the Flask application.

4. Start the backend and frontend servers.

```bash
# Start the Flask backend server
cd ../backend
python app.py

# Start the React frontend development server
cd ../frontend
npm start
```

5. Open your web browser and access the application at `http://localhost:3000`.

## Project Structure

The project is structured as follows:

- **backend/**: Contains the Flask backend code.
- **frontend/**: Contains the React frontend code.
- **database.sql**: SQL schema and queries for setting up the PostgreSQL database.
- **README.md**: This README file.




