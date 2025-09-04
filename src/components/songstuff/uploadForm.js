    /*eslint-disable*/
    import React, { createContext, useContext, useState, useEffect } from "react";
    import "../../styles/upload.css";
    /*eslint-enable*/

    const defaultImageCover = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";

    const uploadContext = createContext({
        mp3Audio: null,
        setMp3Audio: ()=>{},
        mp3File: null,
        setMp3File: ()=>{},
        imageLink: null,
        setImageLink: ()=>{},
        title: null,
        setTitle: () => {},
        artist: null,
        setArtist: () => {},
        producer: null,
        setProducer: () => {},
        releaseDate: null,
        setReleaseDate: () => {},
    });


    export function UploadForm(){
        const [mp3Audio, setMp3Audio] = useState(null);
        const [mp3File, setMp3File] = useState(null);
        const [imageLink, setImageLink] = useState(defaultImageCover);
        const [title, setTitle] = useState("");
        const [artist, setArtist] = useState("");
        const [producer, setProducer] = useState("");
        const [releaseDate, setReleaseDate] = useState(null);
        const [valid, setValid] = useState(false);
        const value = {mp3Audio, setMp3Audio, mp3File, setMp3File, imageLink, setImageLink, title, setTitle, artist, setArtist, producer, setProducer, releaseDate, setReleaseDate};

        const [review, setView] = useState(false);
        const [hide, setHide] = useState(false);

        useEffect(() => {
            if (mp3Audio) {
                mp3Audio.volume = 0.5;
            }
        }, [mp3Audio]);

        useEffect(() => {
            if (mp3File) {
                setMp3Audio(new Audio(mp3File));
            }
        }, [mp3File]);

        useEffect(()=>{
            if (mp3File && title && artist && producer && (imageLink !== defaultImageCover)){
                setValid(true)
            }else{
                setValid(false)
            }
        }, [mp3File, imageLink, title, artist, producer, releaseDate])
        return (
            <uploadContext.Provider value={value}>
                <button className="action-button" onClick={() => setHide(!hide)}>Hide</button>
                {hide ? <></> :             
                <div className="center-div">
                    {review ? <FormDisplay/> : <FormInput/>}
                    <button className="action-button" onClick={() => setView(!review)} hidden={!valid}>Review</button>
                </div>}
            </uploadContext.Provider>
        );
    }

    const validateBasicString = (input) => {
        return (input.length >= 3)
    }

    function FormInput(){
        const {setArtist, setProducer, setTitle} = useContext(uploadContext);

        return(
            <div>
                <h2>Add Song</h2>
                <InputString setFunction={setArtist} setValidation={validateBasicString} prompt={"Artist"} />
                <InputString setFunction={setProducer} setValidation={validateBasicString} prompt={"Producer"} />
                <InputString setFunction={setTitle} setValidation={validateBasicString} prompt={"Song Title"} />
                <InputDate />
                <InputMp3 />
                <InputImageLink />
            </div>
        )
    }

    function FormDisplay() {
        const {artist, title, producer, releaseDate, imageLink, mp3File} = useContext(uploadContext);

        const handleMetadata = () => {
            try{
                const request = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    metadata: {
                        MusicId: 1,
                        CoverImage: imageLink,
                        Title: title,
                        ReleaseDate: releaseDate,
                        Artist: artist,
                        Producer: producer
                    },
                    file_base64: mp3File,
                    filename: title + ".mp3"
                })
            }

            fetch('https://ca6z7cf9h2.execute-api.us-east-1.amazonaws.com/uploadMusic', request)
                .then(resp => resp.json())
                .then(data => alert(data.message));

            } catch (error) {
                console.error("Upload error:", error);
                alert("Failed to upload metadata.");
            }
        }

    //     const handleFile = async () => {
    //     if (!mp3File) {
    //         alert("No MP3 file to upload.");
    //         return;
    //     }

    //     try {
    //         const response = await fetch("https://ca6z7cf9h2.execute-api.us-east-1.amazonaws.com/upload", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "audio/mpeg"
    //             },
    //             body: mp3File
    //         });

    //         const data = await response.json();
    //         console.log("Upload success:", data);
    //         alert(`Upload successful! Music ID: ${data.id}`);
    //     } catch (error) {
    //         console.error("Upload error:", error);
    //         alert("Failed to upload file.");
    //     }
    // };

        return (
            <div className="display-container">
                <h2>Add Song</h2>
                <div className="input-container">
                    <p><strong>Artist:</strong> {artist}</p>
                    <p><strong>Title:</strong> {title}</p>
                    <p><strong>Producer:</strong> {producer}</p>
                    <p><strong>Release Date:</strong> {releaseDate}</p>
                </div>
                <img src={imageLink} alt="song cover" />
                <Player />
                <button className="action-button" onClick={handleMetadata}>submit</button>
            </div>
        );
    }


    function InputMp3(){
        const {setMp3File} = useContext(uploadContext);
        const defaultWarning = "";
        const [warning, setWarning] = useState(defaultWarning);

        const changeMp3File = (event) => {
            const file = event.target.files[0];
            if(file && file.type === 'audio/mpeg'){
                const audioURL = URL.createObjectURL(file);
                const audioTest = new Audio(audioURL);
                setWarning(audioTest.length);
                setMp3File(file);
            }
        }

        return (
            <div className="Input">
                <p className="warning">{warning}</p>
                <input className="action-button" type="file" accept=".mp3Audio, audio/mpeg" onChange={changeMp3File} />
            </div>
        )
    }

    function InputImageLink(){
        const {imageLink, setImageLink} = useContext(uploadContext);
        const defaultWarning = "";
        const [warning, setWarning] = useState(defaultWarning);

        const isImageUrlValid = (url) => {
            return fetch(url, { method: 'HEAD' })
                .then((res) => {
                    const type = res.headers.get('content-type') || '';
                    return res.ok && type.startsWith('image/');
                })
                .catch(() => false);
        }

        const changeImage = (event) => {
            const file = event.target.value;
            isImageUrlValid(file)
                .then((isValid) => {
                    if (isValid) {
                        setWarning(defaultWarning);
                        setImageLink(file);
                    } else {
                        setWarning("bad image");
                        setImageLink(defaultImageCover);
                    }
                });
        }

        return(
            <div className="Input">
                <input type="text" className="action-button" onBlur={changeImage} placeholder="ImageLink" />
                <p className="warning">{warning}</p>
                <img  src={imageLink} alt="Song Cover" />
            </div>
        )
    }

    function InputString({setFunction, setValidation, prompt}){
        const defaultWarning = "";
        const [warning, setWarning] = useState(defaultWarning);

        const updateVar = (event) =>{
            const input = event.target.value;
            if(setValidation(input)){
                setWarning(defaultWarning);
                setFunction(input);
            }else{
                setWarning("invalid " + prompt);
                setFunction(null)
            }
        }
        return(
            <div className="Input">
                <p className="warning">{warning}</p>
                <input className="action-button" type="text" onBlur={updateVar} placeholder={prompt} />
                
            </div>
        )
    }

    function InputDate(){
        const {setReleaseDate} = useContext(uploadContext);

        const maxDate = new Date(Date.now());
        const year = maxDate.getFullYear();
        const month = String(maxDate.getMonth() + 1).padStart(2, '0');
        const day = String(maxDate.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        return (
            <div className="Input">
                <input className="action-button" type="date" max={formatted} onChange={(event) => {setReleaseDate(event.target.value)}} />
            </div>
        )
    }

    function Player(){
        const {mp3Audio} = useContext(uploadContext);

        const Play = () => {
            if(mp3Audio){        
                mp3Audio.play();   
            }    
        }

        const Pause = () => {
            if(mp3Audio){        
                mp3Audio.pause();   
            }    
        }
        return (
            <div className="playback-controls">
                <button className="action-button" onClick={Play}>Test Play</button>
                <button className="action-button" onClick={Pause}>Test Pause</button>            
            </div>
        )
    }


