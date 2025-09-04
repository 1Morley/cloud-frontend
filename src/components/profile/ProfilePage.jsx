import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './profile.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    joinDate: '',
    favoriteGenres: [],
    totalPlaylists: 0,
    totalSongs: 0
  });

  const [editForm, setEditForm] = useState(userProfile);

  //TODO load user profile using playlist data might need to remove the join date and favorite genres
  useEffect(() => {
    async function getNumberOfPlaylists(user_id) {
      try {
        const response = await fetch(`https://9accq9dnfe.execute-api.us-east-1.amazonaws.com/UserPlaylists?userId=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const playlistIds = await response.json();        
        return playlistIds.length;
          
      } catch (error) {
          console.error('Error fetching playlists:', error);
          return 0;
      }
    }

    function loadUserProfile() {
      let session = localStorage.getItem("SessionInformation");
      if (session != null) {
        let sessionJson = JSON.parse(session);
        if (sessionJson.IdToken) {
          let jwtData = jwtDecode(sessionJson.IdToken);
          setUserProfile({
            username: jwtData['cognito:username'],
            email: jwtData.email,
            joinDate: 'January 2024',
            favoriteGenres: [],
            totalPlaylists: 0,
            totalSongs: 0
          });
          setEditForm(userProfile)
        }
      }
    }

    loadUserProfile()
  }, [])

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(userProfile);
  };

  const handleSave = () => {
    setUserProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(userProfile);
  };

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens/state
    localStorage.removeItem("SessionInformation")
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to main page
  };

  const addGenre = (genre) => {
    if (genre.trim() && !editForm.favoriteGenres.includes(genre.trim())) {
      setEditForm({
        ...editForm,
        favoriteGenres: [...editForm.favoriteGenres, genre.trim()]
      });
    }
  };

  const removeGenre = (genreToRemove) => {
    setEditForm({
      ...editForm,
      favoriteGenres: editForm.favoriteGenres.filter(genre => genre !== genreToRemove)
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {userProfile.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1>{userProfile.username}</h1>
          <p className="member-since">Member since {userProfile.joinDate}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{userProfile.totalPlaylists}</span>
              <span className="stat-label">Playlists</span>
            </div>
            <div className="stat">
              <span className="stat-number">{userProfile.totalSongs}</span>
              <span className="stat-label">Songs</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn btn-outline" onClick={handleBack}>
            Back to Music
          </button>
          {!isEditing ? (
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Profile Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Username:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="form-input"
                />
              ) : (
                <span>{userProfile.username}</span>
              )}
            </div>
            <div className="info-item">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="form-input"
                />
              ) : (
                <span>{userProfile.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Security</h2>
          <div className="security-actions">
            <button className="btn btn-warning" onClick={() => alert('Password reset email sent! (not really)')}>
              Reset Password
            </button>
            <p className="security-note">We'll send you an email to reset your password</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Favorite Genres</h2>
          {isEditing ? (
            <div className="genre-editor">
              <div className="genre-input-group">
                <input
                  type="text"
                  placeholder="Add a genre..."
                  className="form-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addGenre(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button 
                  className="btn btn-small"
                  onClick={() => {
                    const input = document.querySelector('.genre-input-group input');
                    if (input) {
                      addGenre(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </button>
              </div>
              <div className="genre-tags">
                {editForm.favoriteGenres.map((genre, index) => (
                  <span key={index} className="genre-tag removable">
                    {genre}
                    <button 
                      className="remove-genre"
                      onClick={() => removeGenre(genre)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="genre-tags">
              {userProfile.favoriteGenres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Browse Music
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/playlists')}>
              My Playlists
            </button>
            <button className="btn btn-outline">
              Upload Music
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}