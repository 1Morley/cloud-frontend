import React, { useContext, useState } from "react";
import { MusicContext } from "./musicContext";
import { hasValidToken } from "../../utils/user.js"
import Popup from 'reactjs-popup';

export function SongList({ musicList }) {
  const { mp3, setTitle, setMp3, setImage, setArtist, setReleaseDate } = useContext(MusicContext);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  const handleAddToPlaylist = (song, close) => {
    const playlist = playlistName.trim() || selectedPlaylist;
    if (!playlist) {
      alert("Please enter a playlist name or select an existing playlist");
      return;
    }
    
    // Add your playlist logic here
    console.log("Adding to playlist:", playlist, "Song:", song.title);
    
    // Reset form
    setPlaylistName('');
    setSelectedPlaylist('');
    close();
  };

  function renderPlaylistButton(input) {
    if (hasValidToken()) {
      return (
        <Popup
          trigger={
            <button 
              className="addToPlaylistBtn" 
              onClick={(e) => e.stopPropagation()}
            >
              Add to Playlist
            </button>
          }
          modal
          nested
        >
          {close => (
            <div className='playlist-modal'>
              <div className='playlist-modal-content'>
                <h4>Add to Playlist</h4>
                
                <div className="song-info">
                  <p>"{input.title}"</p>
                  <p>by {input.artist}</p>
                </div>

                <div className="playlist-form-group">
                  <label className="playlist-form-label">New Playlist Name</label>
                  <input
                    type="text"
                    className="playlist-form-input"
                    placeholder="Enter new playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                </div>

                <div className="playlist-form-group">
                  <label className="playlist-form-label">Or Select Existing Playlist</label>
                  <select 
                    className="playlist-form-select"
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                  >
                    <option value="">Choose a playlist...</option>
                    <option value="favorites">My Favorites</option>
                    <option value="workout">Workout Mix</option>
                    <option value="chill">Chill Vibes</option>
                  </select>
                </div>
              </div>

              <div className="playlist-modal-buttons">
                <button 
                  className="playlist-modal-close-btn"
                  onClick={close}
                >
                  Cancel
                </button>
                <button 
                  className="playlist-modal-add-btn"
                  onClick={() => handleAddToPlaylist(input, close)}
                >
                  Add to Playlist
                </button>
              </div>
            </div>
          )}
        </Popup>
      );
    }
    return null;
  }

  return (
    <div className="mainBody">
      <ul>
        {musicList.map((input, i) => (
          <li key={i} className="songItem">
            <div
              className="songDisplay"
              onClick={() => {
                setTitle(input.title);
                setImage(input.image);
                setArtist(input.artist);
                setReleaseDate(input.releaseDate);
                if (mp3 !== null) {
                  mp3.pause();
                }
                setMp3(new Audio(input.mp3));
              }}
            >
              <img className="songCover" src={input.image} alt={input.title} />
              <div className="songInfo">
                <p className="songTitle">{input.title}</p>
                <p className="songArtist">{input.artist}</p>
                <p className="songReleaseDate">{input.releaseDate}</p>
                {renderPlaylistButton(input)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}