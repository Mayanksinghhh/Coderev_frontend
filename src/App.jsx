import { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import { apiFetch } from './api';
import './App.css';
import Review from './Review';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch('/user/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">CodeRevive</header>

      {!user ? (
        <div className="auth-container">
          {showSignup ? (
            <>
              <Signup onSignup={() => setShowSignup(false)} />
              <button onClick={() => setShowSignup(false)}>
                Already have an account? Login
              </button>
            </>
          ) : (
            <>
              <Login onLogin={setUser} />
              <button onClick={() => setShowSignup(true)}>
                No account? Sign Up
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="user-container">
        <h2>Welcome, {user.username}!</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
        <Review />
      </div>
      
      )}
    </div>
  );
}

export default App;
