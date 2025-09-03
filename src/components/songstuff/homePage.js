/* eslint-disable */
import React, { createContext, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
// import "../../styles/homepage.css";
import ooAudio from '../../tempMusic/audio.mp3'
import disAudio from '../../tempMusic/disAudio.mp3'
import { useContext, useMemo, useEffect } from "react";
/* eslint-enable */

const exampleMusic = [
    {title:"miku song" , mp3: ooAudio ,image:"https://meccha-japan.com/576205-large_default/chibi-figure-hatsune-miku-fuwa-petit-hatsune-miku-series.jpg"}
    ,{title:"other miku song", mp3: disAudio ,image:"https://images.steamusercontent.com/ugc/2461865083547738314/256942E27CA4C41F720506D217DE9E3484AAE8EB/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"}
    ,{title:"looooooooooooong title here eyyyyy" , mp3: ooAudio ,image:"https://meccha-japan.com/576205-large_default/chibi-figure-hatsune-miku-fuwa-petit-hatsune-miku-series.jpg"}

]

const savedSong = createContext({
    title: "",
    setTitle: ()=>{},
    mp3: null,
    setMp3: ()=>{},
    image: "",
    setImage: ()=>{},
    volume: "",
    setVolume: () => {}
})


export function Home(){
    const [title, setTitle] = useState("");
    const [mp3, setMp3] = useState(null);
    const [image, setImage] = useState("");
    const [volume, setVolume] = useState(1);

    const value = { title, mp3, image, volume, setTitle, setMp3, setImage, setVolume};

    //only needs to be here and works for anything
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
        <savedSong.Provider value={value}>
            <div className="mainBody">
                <div className="home-header">
                    <h2>Home Page</h2>
                    <Link to="/profile" className="profile-btn">
                        Profile
                    </Link>
                </div>
                <ul>
                    <ListItems list={exampleMusic} />
                </ul>
            </div>
            <AudioPlayer />

        </savedSong.Provider>
    );
}

function ListItems({list}){
    const {mp3, setTitle, setMp3, setImage } = useContext(savedSong)

    return(
        list.map((input) => 
        <li>
            <div className="songDisplay" onClick={() => {
                    setTitle(input.title)
                    setImage(input.image)
                    if(mp3 !== null){
                        mp3.pause()
                    }
                    setMp3(new Audio(input.mp3))
                }}>
                <img src = {input.image}/>
                <p>{input.title}</p>
            </div>
        </li>)
    )
}

function AudioPlayer(){
    const {title, mp3, image, volume, setVolume} = useContext(savedSong)
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCurrentTime(()=>{
                if(mp3){
                    return mp3.currentTime
                }else{
                    return 0;
                }
            })
        }, 500);
        return () => clearInterval(timer)
    })



    const start = () => {
        if(mp3){
            mp3.play();   
        }
    }
    const stop = () => {
        if(mp3){
            mp3.pause();   
        }    
    }

    const updateVolume = (event) => {
        setVolume(event.target.value)
    }

    const updateDuration = (event) => {
        if(mp3.ended){
            mp3.play()
        }
        let newTime = event.target.value
        mp3.currentTime = newTime
        setCurrentTime(newTime)
    }


    
    if(mp3){
    return (
        <div className="audioDisplay">
            <img src = {image}/>  
            <p>Title: "{title}"</p>          
            <button onClick={start}>Play</button>
            <button onClick={stop}>stop</button>
            <input type="range" min="0" max="1" step={0.01} value={volume} onChange={updateVolume}/>
            <input type="range" min="0" max={mp3.duration} value={currentTime} step={1} onChange={updateDuration}/>
            <h1>currentTime: {currentTime}</h1>

        </div>
    )
}
}

//todo make default view for music + minimize
//todo make uploud audio thing

