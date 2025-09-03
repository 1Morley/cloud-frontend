import "../styles/main.css";
import { MusicProvider } from "../components/home/musicContext";
import { SongList } from "../components/home/songList";
import { AudioPlayer } from "../components/home/audioPlayer";
import { Link, useNavigate } from "react-router-dom";
import mfAudio from "../tempMusic/audio.mp3";
import beerAudio from "../tempMusic/disAudio.mp3";

export default function Main() {
  const exampleMusic = [
    { title: "Audio Track 1", mp3: mfAudio, image: null },
    { title: "Audio Track 2", mp3: beerAudio, image: null }
  ];

  const navigate = useNavigate();

  function go_to_login(){
    navigate("/login")
  }

  function to_profile(){
    
  }

  function is_logged_in(){
    let session = localStorage.getItem("SessionInformation")
    let session_json = JSON.parse(session)
    let access_token = session_json.AccessToken

    if (access_token) {
      let decoded_token = JSON.parse(atob(access_token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000);
      if (decoded_token.exp > now) {
        return (
          <button onClick={go_to_login}>Profile</button>
        )
      }
    }
    else {
        return (
          <button onClick={go_to_login}>Login/SignUp</button>
        )
    }
  }

  return (
    <MusicProvider>
      <div className="page-wrapper">
        <div className="main-container">
          <div className="nav-left">
            <AudioPlayer />
          </div>
          <div className="center-div">
            <div className="center-buttons">
              <button className="action-button">Music</button>
              <button className="action-button">Playlist</button>
              <Link to="/profile" className="profile-btn">
                Profile
              </Link>
            </div>
            <div className="center-content">
              <SongList musicList={exampleMusic} />
            </div>
          </div>
          <div className="nav-right">
            {is_logged_in()}
          </div>
        </div>  
      </div>
    </MusicProvider>
  );
}