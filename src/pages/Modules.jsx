import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Modules.css';
import profileIcon from '../assets/profile-icon.png';

const Modules = () => {
  const navigate = useNavigate();
  const { langKey } = useParams();

  const languageDisplayNames = {
    english: 'English',
    french: 'French',
    telugu: 'Telugu',
    tamil: 'Tamil'
  };

  const [selectedLanguage, setSelectedLanguage] = useState(langKey);
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState([0, 0, 0, 0, 0, 0]);

  const moduleNames = ['Basic 1', 'Basic 2', 'Intermediate 1', 'Intermediate 2', 'Advance 1', 'Advance 2'];

     const calculateProgress = (language) => {
    const updatedProgress = moduleNames.map((_, idx) => {
    const key = `progress-${language}-module${idx + 1}`;
    const data = JSON.parse(localStorage.getItem(key)) || {};
    const total = Object.keys(data).length;
    const correct = Object.values(data).filter(a => a.isCorrect).length;
    const base = 3;
    const percent = total > 0 ? Math.max(base, Math.round((correct / total) * 100)) : base;
    return percent;
  });
  setProgress(updatedProgress);
}

  
  useEffect(() => {
    setSelectedLanguage(langKey);
    calculateProgress(); 
  }, [langKey]);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setSelectedLanguage(selected);
    navigate(`/modules/${selected}`);
  };

  const handleModuleClick = (index) => {
    if (index === 0 || progress[index - 1] >= 70) {
      navigate(`/modules/${selectedLanguage}/module${index + 1}`);
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    }
  };

  return (
    <div className="modules-page">
      <div className="modules-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="back-arrow" onClick={() => navigate('/')}>←</div>
          <div className="language-title">{languageDisplayNames[langKey]}</div>
        </div>

        <div className="top-right">
          <select className="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="telugu">Telugu</option>
            <option value="tamil">Tamil</option>
          </select>
          <img className="profile-icon" src={profileIcon} alt="Profile" onClick={() => navigate('/profile')} />
        </div>
      </div>

      <div className="module-list">
        {moduleNames.map((name, idx) => (
          <div className="module-card" key={idx} onClick={() => handleModuleClick(idx)}>
            <h3>{name}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress[idx]}%` }}></div>
            </div>
            <p>{progress[idx]}% Complete</p>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          Let’s take one step at a time — complete 70% in each module to start the next.
        </div>
      )}
    </div>
  );
};

export default Modules;
