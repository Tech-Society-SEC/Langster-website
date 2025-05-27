import '../styles/Login.css'; 
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    level: 'beginner',
  });

  const [isSignUp, setIsSignUp] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (localStorage.getItem('isLoggedIn') === 'true' && !hasVisitedBefore) {
      setIsFirstLogin(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? 'SignUp submitted:' : 'Login submitted:', formData);

    if (isSignUp) {
      // Save user signup data
      localStorage.setItem('userData', JSON.stringify(formData));
      localStorage.setItem('isLoggedIn', 'true');
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
      if (!hasVisitedBefore) {
        setIsFirstLogin(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      } else {
        navigate('/profile');
      }
    } else {
      // Login check
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
        localStorage.setItem('isLoggedIn', 'true');
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
        if (!hasVisitedBefore) {
          setIsFirstLogin(true);
          localStorage.setItem('hasVisitedBefore', 'true');
        } else {
          navigate('/profile');
        }
      } else {
        alert('Invalid Credentials');
      }
    }
  };

  const closePopupAndRedirect = () => {
    setIsFirstLogin(false);
    navigate('/profile');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Tailor your language learning experience with us!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          /><br />

          {isSignUp && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              /><br />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          /><br />

          {isSignUp && (
            <>
              <select name="level" value={formData.level} onChange={handleChange}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select><br />
            </>
          )}

          <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        </form>

        <p className="toggle-text">
          {isSignUp ? 'Already a user?' : 'New here?'}{' '}
          <span
            onClick={() => setIsSignUp(prev => !prev)}
            className="toggle-link"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>

      {isFirstLogin && (
        <div className="popup">
          <div className="popup-content">
            <p>Let's Dive Deeper into Learning!</p>
            <button onClick={closePopupAndRedirect}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
