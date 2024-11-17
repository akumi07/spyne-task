'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login/logout
import { auth } from '../firebase/firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth'; // Firebase signOut function

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // Handle logout
      signOut(auth).then(() => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login page
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    } else {
      // Redirect to login page
      navigate('/login');
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img src="/logo.svg" alt="Company Logo" />
          </a>
        </div>

        {/* Login/Logout Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={handleLoginLogout}
            className={`py-2 px-4 text-sm font-bold rounded-lg ${isLoggedIn ? 'bg-black text-white' : 'bg-blue-600 text-white'}`}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>
    </header>
  );
}
