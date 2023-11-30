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
     
     <img width="389" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/7ad6b381-5b5c-431e-a66d-e8538780600c">
     <img width="376" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/908304d8-bd0a-48a2-af18-866ab0c1b338">

2. **Manual Workout Logging**
   - Users can log their workouts, including exercise details, duration, and date.
     <img width="1512" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/c23e2423-a0f6-4dd3-babe-fd79d8625b7f">


3. **Visual Progress Tracking**
   - Users can view their fitness progress through graphs and charts.
   - Track metrics such as weight, body measurements, and workout history.
     <img width="1512" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/2d6a9f87-2b6c-40ed-9b3c-d3f4f7ad1d71">

4. **Personalized Goal Setting**
   - Users can set fitness goals and track their progress towards achieving them.
     <img width="1512" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/c24a958c-49fe-4734-a3b9-ee67773c213b">
     <img width="1512" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/2391a977-e61e-4021-9de2-e3fd323d2d4f">

### Additional Features 

5. **Virtual Personal Trainer**
   - Incorporate a virtual personal trainer feature to provide workout recommendations and tips.
     <img width="1512" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/3315ec6f-a8b7-41dd-94c9-c05c8c4a95fc">

6. **Nutritional Tracking**
   - Add the ability for users to track their daily nutritional intake, including calories, macronutrients, and micronutrients.
     <img width="1512" alt="image" src="https://github.com/sisisi222/fitness_app/assets/116410481/d146603c-d981-45f8-84ae-482d6284089f">

7. **User Profile**
   - Users are welcome to upload avatar pictures and post status
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




