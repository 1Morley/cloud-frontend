import "../../styles/login.css"

export default function signupForm(){
    return (
      <div className="container">
            <div className="formItem">
                <label>Username</label>
                <input type="text" placeholder="username"/>
            </div>
            <div className="formItem">
                <label>Email</label>
                <input type="text" placeholder="email"/>
            </div>
            <div className="formItem">
                <label>Password</label>
                <input type="text" placeholder="password"/>
            </div>
        </div>
    )
}