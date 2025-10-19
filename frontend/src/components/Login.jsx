import { useState } from "react";
import axios from "axios";

// Removed import.meta.env check to fix the warning and enforce the required localhost:5000 fallback
// In a standard React/Vite app, this should ideally be:
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// But since that throws a warning, we will hardcode the fallback value:
const API_BASE_URL = 'http://localhost:5000';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        // Use the defined constant
        `${API_BASE_URL}/api/auth/login`, 
        { email, password }
      );
      
      // Successfully logged in
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Update state in App.jsx to trigger conditional rendering
      setUser(res.data.user);
      
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      // Display error message from backend (e.g., "Invalid credentials")
      setError(err.response?.data?.message || "An unexpected error occurred during login."); 
    }
  };

  return (
    <div className="w-100">
      {/* Use the 'card' class defined in App.css / Bootstrap */}
      <form onSubmit={handleLogin} className="card mx-auto mt-2" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">User Login</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input 
            placeholder="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-control"
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control"
            required 
          />
        </div>
        
        {/* Use Bootstrap primary button style */}
        <button 
          type="submit" 
          className="btn btn-primary w-100"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
