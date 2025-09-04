//claude took the original audio player/music list and broke it into 3 different components for better styling 
import React, { createContext, useState, useEffect } from "react";

export const MusicContext = createContext({
  title: "",
  setTitle: () => {},
  mp3: null,
  setMp3: () => {},
  image: "",
  setImage: () => {},
  artist: "",
  setArtist: () => {},
  releaseDate: "",
  setReleaseDate: () => {},
  volume: 1,
  setVolume: () => {}
});

export function MusicProvider({ children }) {
  const [title, setTitle] = useState("");
  const [mp3, setMp3] = useState(null);
  const [image, setImage] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [volume, setVolume] = useState(1);

  const value = { 
    title, mp3, image, artist, releaseDate, volume, 
    setTitle, setMp3, setImage, setArtist, setReleaseDate, setVolume 
  };

  useEffect(() => {
    if (mp3) {
      mp3.volume = volume;
    }
  }, [volume, mp3]);

  useEffect(() => {
    if (mp3) {
      mp3.autoplay = true;
    }
  }, [mp3]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}