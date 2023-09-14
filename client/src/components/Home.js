import React from 'react';
import NavBar from './NavBar';
import WelcomeHeader from './WelcomeHeader';
import AuthSection from './AuthSection';
import FeaturesSection from './FeaturesSection';
import WorkoutLog from './workout/WorkoutLog';
import { useUser } from '../UserContext'; 

function Home() {
    const { user } = useUser(); // Use the context to get the user
    
    // Log the user ID to the console
    //console.log("User ID in Home:", user?.cid);

    // Check if the user is logged in based on whether there's a user object or not
    if (user) {
        return (
            <div className="home-container">
                <NavBar />
                <WorkoutLog userId={user.cid} />
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
