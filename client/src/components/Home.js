import React from 'react';
import NavBar from './NavBar';
import WelcomeHeader from './WelcomeHeader';
import AuthSection from './AuthSection';
import FeaturesSection from './FeaturesSection';
import { Link } from 'react-router-dom';
import '../styles/Home.css'

function Home({ userId }) {

    if (userId) {
        return (
            <div className="home-container">
                <NavBar />
                <div className="welcome-section">
                    <h2>Welcome to FlexiFitness!</h2>
                    <h1>What would you like to do today?</h1>
                    <div className="user-options">
                        <div className='option-link'>
                            <Link to="/workouts">Add/Edit a new workout</Link>
                        </div>
                        <div className='option-link'>
                            <Link to="/add-weight">Add/Edit Your Weight</Link>
                        </div>
                        <div className='option-link'>
                            <Link to="/body-measurement">Add/Edit Your Body Measurement</Link>
                        </div>
                        <div className='option-link'>
                            <Link to="/Goal">Add Your Goal</Link>
                        </div>
                        <div className='option-link'>
                            <Link to="/visual">Video Instructions</Link>
                        </div>
                        <div className='option-link'>
                            <Link to="/bmi">Calculate Your BMI</Link>
                        </div>
                        <div className='option-link'>
                            <Link to="/food-log">Track Your Food Calories</Link>
                        </div>
                    </div>
                    <p>Thank you for using our app!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <NavBar />
            <WelcomeHeader />
            <AuthSection />
            <FeaturesSection />
        </div>
    );
}

export default Home;

