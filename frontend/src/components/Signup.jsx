import { useState } from "react";
import axios from "axios";

// Define a constant for the base URL, falling back to 5000 
// (This resolves the "undefined" in the URL and the environment variable warning)
const API_BASE_URL = 'http://localhost:5000';

const Signup = ({ setUser, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [association, setAssociation] = useState(""); 
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        { name, email, password, association }
      );

      // Successfully signed up and logged in
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user); // Update state in App.jsx to trigger conditional rendering

    } catch (err) {
      console.error("Signup failed:", err.response?.data?.message || err.message);
      // Display error message from backend (e.g., "User already exists")
      setError(err.response?.data?.message || "An unexpected error occurred during signup.");
    }
  };

  return (
    <div className="w-100">
      <form onSubmit={handleSignup} className="card mx-auto mt-5 p-4" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-4">Create Account</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="form-control"
            required
          />
        </div>
        
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
            placeholder="Password (Min 6 chars)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control"
            required
            minLength="6"
          />
        </div>
        
        <div className="mb-4">
          <label className="form-label">Association</label>
          <input 
            placeholder="Association (e.g., Club, Chapter, General)" 
            value={association} 
            onChange={(e) => setAssociation(e.target.value)} 
            className="form-control"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100 mb-3"
        >
          Sign Up
        </button>

        <p className="text-center small-muted">
          Already have an account? 
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="text-decoration-none"> Log in here</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
