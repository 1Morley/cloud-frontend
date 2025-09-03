import "../styles/main.css";
import { MusicProvider } from "../components/home/musicContext";
import { SongList } from "../components/home/songList";
import { AudioPlayer } from "../components/home/audioPlayer";
import { Link } from "react-router-dom";
import mfAudio from "../tempMusic/audio.mp3";
import beerAudio from "../tempMusic/disAudio.mp3";

export default function Main() {
  const exampleMusic = [
    { title: "Audio Track 1", mp3: mfAudio, image: null },
    { title: "Audio Track 2", mp3: beerAudio, image: null }
  ];

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
            <p>Right</p>
          </div>
        </div>
      </div>
    </MusicProvider>
  );
}

//TODO this should probably make the list and not take it as a parameter
function display_music(musicList){
  //TODO this is where the fetch request should be made
  return (
    <SongList musicList={musicList} />
  )
}