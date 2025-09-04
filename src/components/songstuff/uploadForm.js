//used claude to make the upload api calls 
/*eslint-disable*/
import React, { createContext, useContext, useState, useEffect } from "react";
import generateUuid from "../../utils/generateUuid.js"
import "../../styles/upload.css";
/*eslint-enable*/

const defaultImageCover = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";

const uploadContext = createContext({
    mp3Audio: null,
    setMp3Audio: ()=>{},
    mp3File: null,
    setMp3File: ()=>{},
    mp3FileObject: null,
    setMp3FileObject: ()=>{},
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
    const [mp3FileObject, setMp3FileObject] = useState(null);
    const [imageLink, setImageLink] = useState(defaultImageCover);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [producer, setProducer] = useState("");
    const [releaseDate, setReleaseDate] = useState(null);
    const [valid, setValid] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const value = {mp3Audio, setMp3Audio, mp3File, setMp3File, mp3FileObject, setMp3FileObject, imageLink, setImageLink, title, setTitle, artist, setArtist, producer, setProducer, releaseDate, setReleaseDate};

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

    // Fixed validation - image is optional, so don't require custom image
    useEffect(()=>{
        if (mp3File && title && artist && producer){
            setValid(true)
        }else{
            setValid(false)
        }
    }, [mp3File, imageLink, title, artist, producer, releaseDate])

    const handleUpload = async () => {
        if (!valid || !mp3FileObject) {
            setUploadStatus("Please fill in all required fields and select an MP3 file.");
            return;
        }

        setIsUploading(true);
        setUploadStatus("Uploading metadata...");

        try {
            const metadataPayload = {
                MusicId: generateUuid(),
                CoverImage: imageLink,
                Title: title,
                ReleaseDate: releaseDate || new Date().toISOString().split('T')[0],
                Artist: artist,
                Producer: producer
            };

            const metadataResponse = await fetch('https://n9h4ehtf96.execute-api.us-east-1.amazonaws.com/add-metadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadataPayload)
            });

            if (!metadataResponse.ok) {
                throw new Error(`Metadata upload failed: ${metadataResponse.status} ${metadataResponse.statusText}`);
            }

            const metadataResult = await metadataResponse.json();
            setUploadStatus(`Metadata uploaded successfully! ID: ${metadataResult.id}. Now uploading audio file...`);

            const formData = new FormData();
            formData.append('file', mp3FileObject);
            formData.append('id', metadataResult.id.toString());

            const fileResponse = await fetch('https://n9h4ehtf96.execute-api.us-east-1.amazonaws.com/upload', {
                method: 'POST',
                body: formData
            });

            if (!fileResponse.ok) {
                throw new Error(`File upload failed: ${fileResponse.status} ${fileResponse.statusText}`);
            }

            const fileResult = await fileResponse.json();
            setUploadStatus(`Upload completed successfully! 
Metadata ID: ${metadataResult.id}
File ID: ${fileResult.id}
S3 Key: ${fileResult.key}`);

            // Reset form after successful upload
            setTimeout(() => {
                resetForm();
            }, 3000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setMp3Audio(null);
        setMp3File(null);
        setMp3FileObject(null);
        setImageLink(defaultImageCover);
        setTitle("");
        setArtist("");
        setProducer("");
        setReleaseDate(null);
        setView(false);
        setUploadStatus("");
        setValid(false);
    };

    return (
        <uploadContext.Provider value={value}>
            <button className="action-button" onClick={() => setHide(!hide)}>Hide</button>
            {uploadStatus && (
                <div className={`upload-status ${uploadStatus.includes('failed') ? 'error' : 'success'}`}>
                    <pre>{uploadStatus}</pre>
                </div>
            )}
            {hide ? <></> :             
            <div className="center-div">
                {review ? <FormDisplay onUpload={handleUpload} isUploading={isUploading} /> : <FormInput/>}
                <button className="action-button" onClick={() => setView(!review)} hidden={!valid}>
                    {review ? 'Back to Edit' : 'Review'}
                </button>
                {/* Add direct upload button for convenience */}
                {!review && (
                    <button 
                        className="action-button upload-button" 
                        onClick={handleUpload}
                        disabled={!valid || isUploading}
                        hidden={!valid}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Song Now'}
                    </button>
                )}
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

function FormDisplay({ onUpload, isUploading }){
    const {artist, title, producer, releaseDate, imageLink} = useContext(uploadContext);

    return (
        <div className="display-container">
            <h2>Review Song Details</h2>
            <div className="input-container">
                <p><strong>Artist:</strong> {artist}</p>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Producer:</strong> {producer}</p>
                <p><strong>Release Date:</strong> {releaseDate || 'Today'}</p>
            </div>
            <img src={imageLink} alt="song cover" />
            <Player />
            <button 
                className="action-button upload-button" 
                onClick={onUpload}
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload Song'}
            </button>
        </div>
    )
}

const FormDisplayString = ({prompt, value}) =>{
    return(
        <div className="songItem">
            <p className="songTitle">{prompt}: {value}</p>
        </div>
    )
}

function InputMp3(){
    const {mp3Audio, setMp3File, setMp3FileObject} = useContext(uploadContext);
    const defaultWarning = "";
    const [warning, setWarning] = useState(defaultWarning);

    const changeMp3File = (event) => {
        const file = event.target.files[0];
        if(file && file.type === 'audio/mpeg'){
            const audioURL = URL.createObjectURL(file);
            const audioTest = new Audio(audioURL);
            
            // Store both the URL for preview and the file object for upload
            setMp3File(audioURL);
            setMp3FileObject(file);
            
            audioTest.addEventListener('loadedmetadata', () => {
                const duration = Math.round(audioTest.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                setWarning(`Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
            });
            
            setWarning("Loading...");
        } else {
            setWarning("Please select a valid MP3 file");
            setMp3File(null);
            setMp3FileObject(null);
        }
    }

    return (
        <div className="Input">
            <p className="warning">{warning}</p>
            <input className="action-button" type="file" accept=".mp3,audio/mpeg" onChange={changeMp3File} />
        </div>
    )
}

function InputImageLink(){
    const {imageLink, setImageLink} = useContext(uploadContext);
    const defaultWarning = "";
    const [warning, setWarning] = useState(defaultWarning);

    const isImageUrlValid = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                resolve(true);
            };
            
            img.onerror = () => {
                // Fallback to fetch method if image load fails
                fetch(url, { method: 'HEAD' })
                    .then((res) => {
                        const type = res.headers.get('content-type') || '';
                        resolve(res.ok && type.startsWith('image/'));
                    })
                    .catch(() => resolve(false));
            };
            
            img.src = url;
        });
    }

    const changeImage = (event) => {
        const file = event.target.value;
        if (!file.trim()) {
            setWarning(defaultWarning);
            setImageLink(defaultImageCover);
            return;
        }
        
        setWarning("Validating image...");
        isImageUrlValid(file)
            .then((isValid) => {
                if (isValid) {
                    setWarning("Valid image URL");
                    setImageLink(file);
                } else {
                    setWarning("Invalid image URL - using default");
                    setImageLink(defaultImageCover);
                }
            });
    }

    return(
        <div className="Input">
            <input type="text" className="action-button" onBlur={changeImage} placeholder="Image URL (optional)" />
            <p className="warning">{warning}</p>
            <img src={imageLink} alt="Song Cover" style={{maxWidth: '200px', maxHeight: '200px'}} />
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
    const {setReleaseDate, releaseDate} = useContext(uploadContext);

    const maxDate = new Date(Date.now());
    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, '0');
    const day = String(maxDate.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    return (
        <div className="Input">
            <label>Release Date (optional):</label>
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