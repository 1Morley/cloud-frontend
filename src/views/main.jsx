import { MusicProvider } from "../components/home/musicContext"
import { SongList } from "../components/home/songList"
import { AudioPlayer } from "../components/home/audioPlayer"
import { useNavigate } from "react-router-dom"
import { hasValidToken } from "../utils/user.js"
import { useState } from "react"
import "../styles/main.css";
import mfAudio from "../example_music/Potholderz.mp3"
import cover from "../example_music/mmfood.jpg"
import beerAudio from "../example_music/OneBeer.mp3"
import beerCover from "../example_music/onebeer.jpg"

// You'll need to create this component
// import { PlaylistView } from "../components/home/playlistView"

export default function Main() {
  const [activeView, setActiveView] = useState("music"); // Track which view is active
  const exampleMusic = [
    { title: "Potholderz", artist: "MF DOOM", releaseDate: "September 2, 2003", mp3: mfAudio, image: cover },
    { title: "One Beer", artist: "MF DOOM", releaseDate: "November 16, 2004", mp3: beerAudio, image: beerCover }
  ];

  // const exampleMusic = [
  //   { title: "Potholderz", artist: "MF DOOM", releaseDate: "September 2, 2003", mp3: null, image: null },
  //   { title: "One Beer", artist: "MF DOOM", releaseDate: "November 16, 2004", mp3: null, image: null }
  // ];

  const navigate = useNavigate();

  function toLogin(){
    navigate("/login")
  }

  function toProfile(){
    navigate("/profile")
  }

  function toUpload(){
    navigate("/upload")
    navigate("/upload")
  }

  function isLoggedIn(){
    if (hasValidToken()) {
      return (
        <div className="logged-in-buttons">
          <button className="nav-button" onClick={toProfile}>Profile</button>
          <button className="nav-button" onClick={toUpload}>Upload Song</button>
        </div>
      )
    }
    return(
      <button className="nav-button" onClick={toLogin}>Login/SignUp</button>
    )
  }

  async function loadMusic(){
    const response = await fetch('https://n9h4ehtf96.execute-api.us-east-1.amazonaws.com/play/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      sessionStorage.setItem("")
      return (
        <p>Worked</p>
      )
    }
    else {
      return (
        <p>didnt work</p>
      )
    }
  }

  // Function to render the appropriate component based on activeView
  function renderContent() {
    switch(activeView) {
      case "music":
        return <SongList musicList={exampleMusic} />;
      case "playlist":
        // return <PlaylistView />; // You'll need to create this component
        return <p>playlist</p>
      default:
        return <SongList musicList={exampleMusic} />;
    }
  }

  return (
    <MusicProvider>
      {/* <UploadForm></UploadForm> for testing*/}
      <div className="page-wrapper">
        <div className="main-container">
          <div className="nav-left">
            <AudioPlayer />
          </div>
          <div className="center-div">
            <div className="center-buttons">
              <button 
                className={`action-button ${activeView === "music" ? "active" : ""}`}
                onClick={() => setActiveView("music")}
              >
                Music
              </button>
              <button 
                className={`action-button ${activeView === "playlist" ? "active" : ""}`}
                onClick={() => 
                  {if (hasValidToken()) {
                    setActiveView("playlist")
                  }}
                }
              >
                Playlist
              </button>
            </div>
            <div className="center-content">
              {renderContent()}
            </div>
          </div>
          <div className="nav-right">
            {isLoggedIn()}
          </div>
        </div>
      </div>
    </MusicProvider>
  );
}