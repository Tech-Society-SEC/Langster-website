import React from 'react';

import '../styles/Home.css';

import frenchImg from '../assets/french.jpg';
import englishImg from '../assets/english.jpg';
import teluguImg from '../assets/telugu.png';
import tamilImg from '../assets/tamil.jpg';

import frenchFlag from '../assets/flags/french-flag.png';
import englishFlag from '../assets/flags/english-flag.jpg';
import teluguFlag from '../assets/flags/telugu-flag.png';
import tamilFlag from '../assets/flags/tamil-flag.png';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn');


  const handleScrollToLanguages = () => {
    const section = document.getElementById("languages");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleProfileRedirect = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleHistoryRedirect = () => {
    navigate('/history');
  };

  return (
    <div className="home-container">
      {/* Top Navbar – Logo + Buttons */}
      <div className="top-navbar">
        <div className="navbar-logo">
          <div className="logo-circle" />
          <span className="logo-text">LANGSTER</span>
        </div>
        <div className="nav-buttons">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button onClick={handleScrollToLanguages}>Languages</button>
          <button onClick={handleProfileRedirect}>User Profile</button>
          <button onClick={handleLoginRedirect}>Login</button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="about-text">
          <h2>Welcome to Langster!</h2>
          <p>Your personalized language learning platform.</p>
        </div>
        <div className="about-image" />
      </header>

      {/* Languages Section */}
      <section id="languages" className="languages-section">
        <h3>Select a Language to Explore</h3>
        <div className="language-cards">
          {/* French Card */}
          <div className="language-card">
            <img src={frenchImg} alt="French" className="card-image" />
            <div className="card-text">
              <span>French</span>
              <img src={frenchFlag} alt="French Flag" className="flag-icon" />
            </div>
            {
            isLoggedIn === 'true' ? (
            <Link to="/modules/french">
            <button className="start-btn">Jump Into Lessons</button>
            </Link>
             ) : (
            <Link to="/history/french">
            <button className="start-btn">View History</button>
            </Link>
            )
            }
            </div>

          {/* English Card */}
          <div className="language-card">
            <img src={englishImg} alt="English" className="card-image" />
            <div className="card-text">
              <span>English</span>
              <img src={englishFlag} alt="English Flag" className="flag-icon" />
            </div>
             {
             isLoggedIn === 'true' ? (
             <Link to="/modules/english">
            <button className="start-btn">Jump Into Lessons</button>
            </Link>
             ) : (
            <Link to="/history/english">
            <button className="start-btn">View History</button>
            </Link>
             )
             }
          </div>

          {/* Telugu Card */}
          <div className="language-card">
            <img src={teluguImg} alt="Telugu" className="card-image" />
            <div className="card-text">
              <span>Telugu</span>
              <img src={teluguFlag} alt="Telugu Flag" className="flag-icon" />
            </div>
            {
            isLoggedIn === 'true' ? (
            <Link to="/modules/telugu">
             <button className="start-btn">Jump Into Lessons</button>
            </Link>
           ) : (
           <Link to="/history/telugu">
            <button className="start-btn">View History</button>
            </Link>
            )
            }
          </div>

          {/* Tamil Card */}
          <div className="language-card">
            <img src={tamilImg} alt="Tamil" className="card-image" />
            <div className="card-text">
              <span>Tamil</span>
              <img src={tamilFlag} alt="Tamil Flag" className="flag-icon" />
            </div>
            {
            isLoggedIn === 'true' ? (
           <Link to="/modules/tamil">
           <button className="start-btn">Jump Into Lessons</button>
           </Link>
           ) : (
           <Link to="/history/tamil">
           <button className="start-btn">View History</button>
           </Link>
            )
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
