import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/NavBar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import WorkoutLog from './components/workout/WorkoutLog'; 
import WeightInputForm from './components/weight/WeightInputForm';
import MeasurementInputForm from './components/bodyMeasurement/MeasurementInputForm';
import GoalSettingForm from './components/GoalSettingForm'
import VideoList from './components/visualTraining/VideoList';
import VideoPlayer from './components/visualTraining/VideoPlayer';
import BMICalculator from './components/nutrition/BMICalculator';
import DailyFoodLog from './components/nutrition/DailyFoodLog';
import CreateDiscussionTopic from './components/discussion/CreateDiscussionTopic';
import DiscussionList from './components/discussion/DiscussionList';
import DiscussionTopicDetail from './components/discussion/DiscussionTopicDetail';
import FeedBack from './components/feedback/FeedBack'

import { useUser } from './UserContext'; 

function App() {
  const { user } = useUser();
  const userId = user?.cid;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home userId={userId} />} />
          <Route path="/register" element={<Register userId={userId} />} />
          <Route path="/login" element={<Login userId={userId} />} />
          <Route path="/workouts" element={<WorkoutLog userId={userId} />} />
          <Route path="/add-weight" element={<WeightInputForm userId={userId} />} />
          <Route path="/body-measurement" element={<MeasurementInputForm userId={userId} />} />
          <Route path="/goal" element={<GoalSettingForm userId={userId} />} />
          <Route path="/visual" element={<VideoList />} />
          <Route path="/visual/:videoID" element={<VideoPlayer />} />
          <Route path="*" element={<MainRoutes />} />
          <Route path="/bmi" element={<BMICalculator userId={userId} />} />
          <Route path="/food-log" element={<DailyFoodLog userId={userId} />} />
          <Route path="/discussion" element={<DiscussionList />} />
          <Route path="/discussion/create" element={<CreateDiscussionTopic userId={userId} />} />
          <Route path="/discussion/:id" element={<DiscussionTopicDetail userId={userId} />} />
          <Route path="/feedback" element={<FeedBack userId={userId} />} />
          

        </Routes>
      </BrowserRouter>
    </div>
  );
}

function MainRoutes() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />} 
      <Routes>
        <Route index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workouts" element={<WorkoutLog />} />
        <Route path="/add-weight" element={<WeightInputForm />} />
        <Route path="/body-measurement" element={<MeasurementInputForm />} />
        <Route path="/goal" element={<GoalSettingForm />} />
        <Route path="/visual" element={<VideoList />} />
        <Route path="/visual/:videoID" element={<VideoPlayer />} />
        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/food-log" element={<DailyFoodLog />} />
        <Route path="/discussion" element={<DiscussionList />} />
        <Route path="/discussion/create" element={<CreateDiscussionTopic />} />
        <Route path="/discussion/:id" element={<DiscussionTopicDetail />} />
        <Route path="/feedback" element={<FeedBack />} />

      </Routes>
    </>
  );
}

export default App;
