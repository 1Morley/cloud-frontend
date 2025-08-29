import "../styles/main.css";
import { MusicProvider } from "../components/home/musicContext";
import { SongList } from "../components/home/songList";
import { AudioPlayer } from "../components/home/audioPlayer";
import mfAudio from "../example_music/Potholderz.mp3";
import cover from "../example_music/mmfood.jpg";
import beerAudio from "../example_music/OneBeer.mp3";
import beerCover from "../example_music/onebeer.jpg";

export default function Main() {
  const exampleMusic = [
    { title: "Potholderz", mp3: mfAudio, image: cover },
    { title: "One Beer", mp3: beerAudio, image: beerCover }
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
    
    <SongComponent musicList={musicList} />
  )
}