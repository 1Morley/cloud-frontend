import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { FormProvider, useForm} from "react-hook-form";
import "../../styles/login.css";

export default function LoginForm(){
    const nav = useNavigate();
    const methods = useForm();
    const {register, handleSubmit, formState: { errors }} = methods;

    async function submitForm(username, password){
    //TODO this needs to be the cognito url
        const res = await fetch("https://us-east-15deghugpi.auth.us-east-1.amazoncognito.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            //TODO get te client id
            body: new URLSearchParams({
                grant_type: "password",
                username: username,
                password: password
            })
        })

        if (res.ok){
            let data = JSON.stringify(await res.json())
            sessionStorage.setItem("SessionInformation", data)
            nav("/")
        }
    };

    return (
        <FormProvider {...methods}>
            <form className="Container" noValidate onSubmit={submitForm}>
                <div className="formItem">
                    <label>Username</label>
                    <input type="text" placeholder="username" {...register("username", {
                        required: "Username is required",
                        //TODO i might want to make some kind of regex to define a username or a function to make it unique
                        // pattern: {
                        //     value: /^[A-z0-9]([A-z0-9._+]*)[A-z0-9]\@([A-z0-9._+]*\.)*(\w{2,4})$/,
                        //     message: "Invalid email address"
                        // }
                    })}/>
                    {errors.email && (
                        <span className="error-message">{errors.email.message}</span>
                    )}
                </div>
                <div className="formItem">
                    <label>Password</label>
                    <input type="password" placeholder="password" {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: /^(?=.*?[A-Z])(?=.*?[0-9]).{12}.*$/,
                            message: "Must have 12 characters 1 number and 1 capital letter"
                        }
                    })}/>
                    {errors.password && (
                        <span className="error-message">{errors.password.message}</span>
                    )}
                </div>
                <button className="button">Login</button>
            </form>
        </FormProvider>
    )
}   