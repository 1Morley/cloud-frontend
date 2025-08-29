import React, { useContext, useState, useEffect } from "react";
import { MusicContext } from "./musicContext";

export function AudioPlayer() {
const { title, mp3, image, volume, setVolume } = useContext(MusicContext);
const [currentTime, setCurrentTime] = useState(0);

useEffect(() => {
    const timer = setInterval(() => {
    setCurrentTime(() => {
        if (mp3) {
        return mp3.currentTime;
        } else {
        return 0;
        }
    });
    }, 500);
    return () => clearInterval(timer);
});

const start = () => {
    if (mp3) {
    mp3.play();
    }
};

const stop = () => {
    if (mp3) {
    mp3.pause();
    }
};

const updateVolume = (event) => {
    setVolume(event.target.value);
};

const updateDuration = (event) => {
    if (mp3.ended) {
    mp3.play();
    }
    let newTime = event.target.value;
    mp3.currentTime = newTime;
    setCurrentTime(newTime);
};

if (mp3) {
    return (
    <div className="audioDisplay">
        <div className="audio-info">
        <img src={image} alt={title} />
        <p>Title: "{title}"</p>
        </div>
        <div className="playback-controls">
        <button onClick={start}>Play</button>
        <button onClick={stop}>Stop</button>
        </div>
        <div className="slider-container">
        <div className="slider-row">
            <span className="slider-label">Volume</span>
            <input 
            type="range" 
            min="0" 
            max="1" 
            step={0.01} 
            value={volume} 
            onChange={updateVolume}
            />
        </div>
        <div className="slider-row">
            <span className="slider-label">Progress</span>
            <input 
            type="range" 
            min="0" 
            max={mp3.duration || 0} 
            value={currentTime} 
            step={1} 
            onChange={updateDuration}
            />
        </div>
        <div className="time-display">
            Time: {Math.floor(currentTime)}s
        </div>
        </div>
    </div>
    );
}
return null; // Don't render anything if no song is selected
}