import { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../../styles/login.css";

export default function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();


    //TODO this needs to be completed and tested with the actual end point
    async function onClickLogin(){

        try {
            //TODO change the endpoint 
            // const res = await fetch("localhost:3003/login", {
            //     method: "GET",
            //     headers: {
            //         "Content-type" : "application/json"
            //     },
            //     body: JSON.stringify({email, password})
            // });

            nav("/");
        }
        catch {

        }
    }

    return (
        <div className="container">
            <div className="formItem">
                <label>Email</label>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="formItem">
                <label>Password</label>
                <input type="text" placeholder="password" value={password} onChange={(p) => setPassword(p.target.value)}/>
            </div>
            <button className="button" onClick={onClickLogin}>Login</button>
        </div>
    )
}