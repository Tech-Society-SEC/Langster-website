import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: 'Username',
    email: 'abc@domain.com',
    bio: 'Add your description...',
    learningLanguage: 'English',
    progress: 3,
    streak: 0,
    profileImage: null,
    backgroundImage: null,
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const navigate = useNavigate();
  const profileImgInputRef = useRef(null);
  const bgImgInputRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    let currentStreak = parseInt(localStorage.getItem('streakCount')) || 0;

    if (!lastLoginDate) {
      localStorage.setItem('lastLoginDate', today);
      localStorage.setItem('streakCount', 1);
      currentStreak = 1;
    } else {
      const lastDate = new Date(lastLoginDate);
      const currentDate = new Date(today);
      const diffTime = currentDate - lastDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak += 1;
        localStorage.setItem('streakCount', currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
        localStorage.setItem('streakCount', 1);
      }
      localStorage.setItem('lastLoginDate', today);
    }

    const savedData = JSON.parse(localStorage.getItem('userData'));
    if (savedData) {
      setProfileData(prev => ({
        ...prev,
        username: savedData.username || prev.username,
        email: savedData.email || prev.email,
        bio: savedData.bio || prev.bio,
        profileImage: savedData.profileImage || null,
        backgroundImage: savedData.backgroundImage || null,
      }));
    }

    setProfileData(prev => ({
      ...prev,
      streak: currentStreak,
    }));
  }, []);

  const handleFieldClick = (field) => {
    setEditingField(field);
    setTempValue(profileData[field]);
  };

  const handleFieldChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleFieldKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      updateField(field);
    }
  };
  
  const updateField = (field) => {
    setProfileData(prev => ({
      ...prev,
      [field]: tempValue,
    }));
    setEditingField(null);

    const savedData = JSON.parse(localStorage.getItem('userData')) || {};
    savedData[field] = tempValue;
    localStorage.setItem('userData', JSON.stringify(savedData));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({
          ...prev,
          [type]: reader.result,
        }));
        const savedData = JSON.parse(localStorage.getItem('userData')) || {};
        savedData[type] = reader.result;
        localStorage.setItem('userData', JSON.stringify(savedData));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = (type) => {
    if (type === 'profileImage') {
      profileImgInputRef.current.click();
    } else if (type === 'backgroundImage') {
      bgImgInputRef.current.click();
    }
  };
   
  const handleLogout = () => {
  localStorage.clear();  
  sessionStorage.clear(); 
  navigate('/');
};

  return (
    <div className="profile-page">
      <div className="profile-header">
        <span className="back-arrow" onClick={() => navigate('/')}>←</span>
        <img
          src={profileData.backgroundImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
          alt="Background"
          className="background-image"
          onClick={() => triggerImageUpload('backgroundImage')}
        />
        <input
          type="file"
          ref={bgImgInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => handleImageChange(e, 'backgroundImage')}
        />
        <div className="edit-icon" onClick={() => triggerImageUpload('backgroundImage')}>✏</div>
        <div className="profile-image-container">
          <img
            src={profileData.profileImage || "src/assets/profile-icon.png"}
            alt="User"
            className="profile-image"
            onClick={() => triggerImageUpload('profileImage')}
          />
          <input
            type="file"
            ref={profileImgInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'profileImage')}
          />
          <div className="edit-icon" onClick={() => triggerImageUpload('profileImage')}>✏</div>
        </div>
      </div>

      <div className="profile-details">
        <div onClick={() => handleFieldClick('bio')}>
          <strong>Description:</strong>
          {editingField === 'bio' ?
            (
              <input type="text"
                value={tempValue}
                onChange={handleFieldChange}
                onKeyDown={(e) => handleFieldKeyDown(e, 'bio')}
                autoFocus />
            ) :
            (
              <p>{profileData.bio}</p>
            )}
        </div>

        <div className="info-boxes">
          <div className="info-box" onClick={() => handleFieldClick('username')}>
            <strong>Username:</strong>
            {editingField === 'username' ?
              (
                <input type="text"
                  value={tempValue}
                  onChange={handleFieldChange}
                  onKeyDown={(e) => handleFieldKeyDown(e, 'username')}
                  autoFocus />
              ) :
              (
                <p>{profileData.username}</p>
              )}
          </div>

          <div className="info-box" onClick={() => handleFieldClick('email')}>
            <strong>Email:</strong>
            {editingField === 'email' ?
              (
                <input type="email" value={tempValue}
                  onChange={handleFieldChange}
                  onKeyDown={(e) => handleFieldKeyDown(e, 'email')}
                  autoFocus />
              ) :
              (
                <p>{profileData.email}</p>
              )}
          </div>

          <div className="info-box">
            <strong>🔥 Streak:</strong> {profileData.streak} days
          </div>

          <div className="info-box">
            <strong>Completed language:</strong> NA
          </div>

          <div className="info-box">
            <strong>Learning language:</strong> {profileData.learningLanguage}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${profileData.progress}%` }}
              ></div>
            </div>
          </div>
           
            <button className="logout-button" onClick={handleLogout}>Log Out</button>

        </div>
      </div>
    </div>
  );
};

export default Profile;