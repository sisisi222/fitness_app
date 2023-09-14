import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/NavBar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import WorkoutLog from './components/workout/WorkoutLog'; 

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workouts" element={<WorkoutLog />} />
          <Route path="*" element={<MainRoutes />} />
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
      </Routes>
    </>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import Home from './components/Home';
// import Navbar from './components/NavBar'
// import Register from './components/auth/Register';
// import Login from './components/auth/Login';

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<MainRoutes />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// function MainRoutes() {
//   const location = useLocation();

//   return (
//     <>
//       {location.pathname !== "/" && <Navbar />} {/* Adjust the Navbar condition as per your requirements */}
//       <Routes>
//         <Route index element={<Home />} />  {/* Add any props you need for Home here */}
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         {/* Add any other routes that you might need */}
//       </Routes>
//     </>
//   );
// }

// export default App;
