import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../styles/logo.png';

function NavBar() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="Fitness Tracker Logo" className="logo-img" />
                    <div className="logo-text-container">
                        <span className="logo-text">FlexiFitness</span>
                        <span className="logo-slogan">Stretch-Strengthen-Succeed</span>
                    </div>
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/register" className="nav-link">
                            Register
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/NavBar.css';
// import logo from '../styles/logo.png';  // Adjust the path accordingly.

// function NavBar() {
//     return (
//         <nav className="navbar">
//             <div className="nav-container">
//                 <Link to="/" className="nav-logo">
//                     <img src={logo} alt="Fitness Tracker Logo" className="logo-img" />
//                     <div className="logo-text-container">
//                         <span className="logo-text">FlexiFitness</span>
//                         <span className="logo-slogan">Stretch-Strengthen-Succeed</span>
//                     </div>
//                 </Link>

//                 <ul className="nav-menu">
//                     <li className="nav-item">
//                         <Link to="/" className="nav-link">
//                             Home
//                         </Link>
//                     </li>
//                     <li className="nav-item">
//                         <Link to="/register" className="nav-link">
//                             Register
//                         </Link>
//                     </li>
//                     <li className="nav-item">
//                         <Link to="/login" className="nav-link">
//                             Login
//                         </Link>
//                     </li>
//                 </ul>
//             </div>
//         </nav>
//     );
// }

// export default NavBar;
