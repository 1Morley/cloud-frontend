import React, { useState } from "react";
import LoginForm from "../components/auth/loginForm";
import SignUpForm from "../components/auth/signupForm";
import { useNavigate } from "react-router-dom"; 
import "../styles/login.css";

export default function Login() {
  const [currentForm, setCurrentForm] = useState("login"); // <--- fixed here
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="formWrapper">
        <div className="tabButtons">
          <button className={currentForm === "login" ? "active" : ""}onClick={() => setCurrentForm("login")}> Login </button>
          <button className={currentForm === "signup" ? "active" : ""} onClick={() => setCurrentForm("signup")}> Sign Up </button>
        </div>

        <div className="currentForm">
          {currentForm === "login" && <LoginForm />}
          {currentForm === "signup" && <SignUpForm />}
        </div>
      </div>
    </div>
  );
}
