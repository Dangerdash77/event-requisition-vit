import React, { useState, useEffect } from 'react';
import EventForm from './components/EventForm.jsx'; // Added .jsx extension
import Login from './components/Login.jsx';       // Added .jsx extension
import Signup from './components/Signup.jsx';      // Added .jsx extension

function App() {
  // State to hold user data (null if logged out, object if logged in)
  const [user, setUser] = useState(null);
  // State to switch between Login and Signup forms
  const [isLoginView, setIsLoginView] = useState(true);

  // 1. Check localStorage on component mount to see if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        // Clear invalid storage items
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoginView(true); // Default back to login screen
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">VIT Events - Event Requisition</h2>

      {user ? (
        // --- LOGGED IN VIEW: Show Event Form and Logout button ---
        <>
          <div className="d-flex justify-content-end mb-3">
            <span className="small-muted me-3 align-self-center">
              Welcome, **{user.name}** ({user.association})
            </span>
            <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">
              Logout
            </button>
          </div>
          <EventForm />
        </>
      ) : (
        // --- LOGGED OUT VIEW: Show Login or Signup ---
        <div className="d-flex flex-column align-items-center">
          {isLoginView ? (
            <Login setUser={setUser} />
          ) : (
            <Signup setUser={setUser} />
          )}

          <div className="mt-3 text-center">
            {isLoginView ? (
              <p>
                Don't have an account? 
                <button 
                  className="btn btn-link p-0 ms-2" 
                  onClick={() => setIsLoginView(false)}
                >
                  **Sign Up**
                </button>
              </p>
            ) : (
              <p>
                Already have an account? 
                <button 
                  className="btn btn-link p-0 ms-2" 
                  onClick={() => setIsLoginView(true)}
                >
                  **Login**
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
