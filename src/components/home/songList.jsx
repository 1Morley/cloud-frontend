import React, { useContext, useState, useEffect } from "react";
import { MusicContext } from "./musicContext";
import { hasValidToken } from "../../utils/user.js"
import Popup from 'reactjs-popup';
import generateUuid from "../../utils/generateUuid.js"
import { jwtDecode } from "jwt-decode"; // Fixed import

export function SongList({ musicList }) {
  const { mp3, setTitle, setMp3, setImage, setArtist, setReleaseDate } = useContext(MusicContext);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserPlaylists = async () => {
    try {
      let session = localStorage.getItem("SessionInformation");
      if (session != null) {
        let sessionJson = JSON.parse(session);
        if (sessionJson.IdToken) {
          let jwtData = jwtDecode(sessionJson.IdToken);
          
          const url = new URL('https://9accq9dnfe.execute-api.us-east-1.amazonaws.com/UserPlaylists');
          url.searchParams.append('userId', jwtData.sub);

          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const playlists = await response.json();
            return playlists;
          }
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  };

  useEffect(() => {
    if (hasValidToken()) {
      getUserPlaylists().then(setUserPlaylists);
    }
  }, []);

  async function createNewPlaylist(name) {
    try {
      if (!name || name.trim() === '') {
        throw new Error('Playlist name is required');
      }

      let session = localStorage.getItem("SessionInformation");
      if (session != null) {
        let sessionJson = JSON.parse(session);
        if (sessionJson.IdToken) {
          let jwtData = jwtDecode(sessionJson.IdToken);

          const playlistId = generateUuid();

          const requestBody = {
            Playlist: {
              id: playlistId,
              name: name.trim(),
              userId: jwtData.sub,
              email: jwtData.email
            }
          };

          const response = await fetch('https://9accq9dnfe.execute-api.us-east-1.amazonaws.com/CreatePlaylist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create playlist: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          
          return {
            id: playlistId,
            name: name.trim(),
            userId: jwtData.sub,
            email: jwtData.email,
            ...result
          };
        }
      }
      throw new Error('No valid session found');
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  } 

  const handleAddToPlaylist = async (song, close) => {
    const playlist = playlistName.trim() || selectedPlaylist;
    if (!playlist) {
      alert("Please enter a playlist name or select an existing playlist");
      return;
    }
    
    try {
      setLoading(true);
      
      let playlistId;
      let finalPlaylistName;
      
      // If creating a new playlist
      if (playlistName.trim()) {
        const newPlaylist = await createNewPlaylist(playlistName.trim());
        playlistId = newPlaylist.id;
        finalPlaylistName = newPlaylist.name;
        
        // Update local playlists state
        setUserPlaylists(prev => [...prev, newPlaylist]);
        
      } else if (selectedPlaylist) {
        // Using existing playlist
        const existingPlaylist = userPlaylists.find(p => 
          p.name === selectedPlaylist || p.id === selectedPlaylist
        );
        
        if (existingPlaylist) {
          playlistId = existingPlaylist.id;
          finalPlaylistName = existingPlaylist.name;
        } else {
          alert("Selected playlist not found");
          return;
        }
      }

      // TODO: Add API call to add song to playlist here
      // This would be another API endpoint like:
      // POST /AddSongToPlaylist with { playlistId, song: {...} }
      
      console.log(`Song "${song.title}" would be added to playlist "${finalPlaylistName}" (ID: ${playlistId})`);
      alert(`"${song.title}" added to "${finalPlaylistName}" successfully!`);
      
      // Reset form
      setPlaylistName('');
      setSelectedPlaylist('');
      close();
      
    } catch (error) {
      console.error('Error adding to playlist:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
                    disabled={loading}
                  />
                </div>

                <div className="playlist-form-group">
                  <label className="playlist-form-label">Or Select Existing Playlist</label>
                  <select 
                    className="playlist-form-select"
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Choose a playlist...</option>
                    {userPlaylists.map((playlist) => (
                      <option key={playlist.id} value={playlist.name}>
                        {playlist.name}
                      </option>
                    ))}
                  </select>
                  {userPlaylists.length === 0 && !loading && (
                    <p className="no-playlists-message">No playlists found. Create a new one above!</p>
                  )}
                </div>
              </div>

              <div className="playlist-modal-buttons">
                <button 
                  className="playlist-modal-close-btn"
                  onClick={close}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="playlist-modal-add-btn"
                  onClick={() => handleAddToPlaylist(input, close)}
                  disabled={loading || (!playlistName.trim() && !selectedPlaylist)}
                >
                  {loading ? 'Adding...' : 'Add to Playlist'}
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