import React, { useContext } from "react";
import { MusicContext } from "./musicContext";

export function SongList({ musicList }) {
  const { mp3, setTitle, setMp3, setImage } = useContext(MusicContext);

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
                if (mp3 !== null) {
                  mp3.pause();
                }
                setMp3(new Audio(input.mp3));
              }}
            >
              <img className="songCover" src={input.image} alt={input.title} />
              <p className="songTitle">{input.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}