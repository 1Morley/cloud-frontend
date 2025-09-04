import "../styles/main.css";
import { MusicProvider } from "../components/home/musicContext"
import { SongList } from "../components/home/songList"
import { AudioPlayer } from "../components/home/audioPlayer"
import { useNavigate } from "react-router-dom"
import { hasValidToken } from "../utils/user.js"
import { UploadForm } from "../components/songstuff/uploadForm.js";
// import mfAudio from "../example_music/Potholderz.mp3"
// import cover from "../example_music/mmfood.jpg"
// import beerAudio from "../example_music/OneBeer.mp3"
// import beerCover from "../example_music/onebeer.jpg"

export default function Main() {
  // const exampleMusic = [
  //   { title: "Potholderz", artist: "MF DOOM", releaseDate: "September 2, 2003", mp3: mfAudio, image: cover },
  //   { title: "One Beer", artist: "MF DOOM", releaseDate: "November 16, 2004", mp3: beerAudio, image: beerCover }
  // ];

  const exampleMusic = [
    { title: "Potholderz", artist: "MF DOOM", releaseDate: "September 2, 2003", mp3: null, image: null },
    { title: "One Beer", artist: "MF DOOM", releaseDate: "November 16, 2004", mp3: null, image: null }
  ];

  const navigate = useNavigate();

  function toLogin(){
    navigate("/login")
  }

  function toProfile(){
    navigate("/profile")
  }

  function toUpload(){
    navigate("/upload")
  }

  function isLoggedIn(){
    if (hasValidToken()) {
      return (
        <div class="nav-right logged-in-buttons">
          <button className="nav-button" onClick={toProfile}>Profile</button>
          <button className="nav-button" onClick={toUpload}>Upload Song</button>
        </div>
      )
    }

    return(
      <button className="nav-button" onClick={toLogin}>Login/SignUp</button>
    )
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
              <button className="action-button">Music</button>
              <button className="action-button">Playlist</button>
              {/* <Link to="/profile" className="profile-btn">
                Profile
              </Link> */}
            </div>
            <div className="center-content">
              <SongList musicList={exampleMusic} />
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