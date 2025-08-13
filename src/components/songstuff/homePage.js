/* eslint-disable */
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import {useRef} from 'react';
import "../../styles/homepage.css";
import example from '../../tempMusic/audio.mp3'

/* eslint-enable */

const exampleMusic = [
    {title:"miku song" ,image:"https://meccha-japan.com/576205-large_default/chibi-figure-hatsune-miku-fuwa-petit-hatsune-miku-series.jpg"}
    ,{title:"other miku song" ,image:"https://images.steamusercontent.com/ugc/2461865083547738314/256942E27CA4C41F720506D217DE9E3484AAE8EB/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"}
    ,{title:"looooong title here eyyyyy" ,image:"https://meccha-japan.com/576205-large_default/chibi-figure-hatsune-miku-fuwa-petit-hatsune-miku-series.jpg"}

]



export function Home (){
    const navigate = useNavigate();

    
    let thing = useRef(0); // resets on reload 
    const [test, setTest] = useState(''); 
    let audio = new Audio(example)

    const start = () => {
        audio.play();   
    }
    const stop = () => {
        audio.pause();   
    }

    return (
        <div>
            <h2>Home Page</h2>
            <ul>
                {listItems(exampleMusic)}            
            </ul>
            <h2>audio testing stuff:</h2>
            <button onClick={start}>Play</button>
            <button onClick={stop}>stop</button>

        </div>
    );
};

function listItems(list){
    return(
        list.map((input) => 
        <li>
            <div className="songDisplay" onClick={clickMusic}>
                <img src = {input.image}/>
                <p>{input.title}</p>
            </div>
        </li>)
    )
}

function clickMusic(){
    alert("this will do something...eventually...i think")

}
