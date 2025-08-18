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
import "../../styles/homepage.css";
import ooAudio from '../../tempMusic/audio.mp3'
import disAudio from '../../tempMusic/disAudio.mp3'
import { useContext, useMemo } from "react";
/* eslint-enable */

const exampleMusic = [
    {title:"miku song" , mp3: ooAudio ,image:"https://meccha-japan.com/576205-large_default/chibi-figure-hatsune-miku-fuwa-petit-hatsune-miku-series.jpg"}
    ,{title:"other miku song", mp3: disAudio ,image:"https://images.steamusercontent.com/ugc/2461865083547738314/256942E27CA4C41F720506D217DE9E3484AAE8EB/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"}
    ,{title:"looooooooooooong title here eyyyyy" , mp3: ooAudio ,image:"https://meccha-japan.com/576205-large_default/chibi-figure-hatsune-miku-fuwa-petit-hatsune-miku-series.jpg"}

]

const savedSong = createContext({
    title: "",
    setTitle: ()=>{},
    mp3: "",
    setMp3: ()=>{},
    image: "",
    setImage: ()=>{},
})

export function Home(){
    const [title, setTitle] = useState("");
    const [mp3, setMp3] = useState(null);
    const [image, setImage] = useState("");
    const value = { title, mp3, image, setTitle, setMp3, setImage };

    return (
        <savedSong.Provider value={value}>
            <div className="mainBody">
                <h2>Home Page</h2>
                <ul>
                    <ListItems list={exampleMusic} />
                </ul>
            </div>
            <AudioPlayer />

        </savedSong.Provider>
    );
}

function ListItems({list}){
    const {title, mp3, image, setTitle, setMp3, setImage } = useContext(savedSong)

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
    const {title, mp3, image} = useContext(savedSong)

    const start = () => {
        mp3.play();   
    }
    const stop = () => {
        mp3.pause();   
    }
    return (
        <div className="audioDisplay">
            <img src = {image}/>  
            <p>Title: "{title}"</p>          
            <button onClick={start}>Play</button>
            <button onClick={stop}>stop</button>
        </div>
    )
}





