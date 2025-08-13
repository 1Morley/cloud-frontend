import { useState } from "react";
import "../../styles/login.css"

export default function SignUpForm(){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        //TODO add onchange and on click for api fetch
      <div className="container">
            <div className="formItem">
                <label>Username</label>
                <input type="text" placeholder="username" value={username}/>
            </div>
            <div className="formItem">
                <label>Email</label>
                <input type="text" placeholder="email" value={email}/>
            </div>
            <div className="formItem">
                <label>Password</label>
                <input type="text" placeholder="password" value={password}/>
            </div>
            <button className="button">Sign Up</button>
        </div>
    )
}