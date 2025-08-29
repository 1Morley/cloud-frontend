import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { FormProvider, useForm} from "react-hook-form";
import "../../styles/login.css";

export default function LoginForm(){
    const nav = useNavigate();
    const methods = useForm();
    const {register, handleSubmit, formState: { errors }} = methods;


    //TODO this needs to be completed and tested with the actual end point
    async function submitForm(){

        try {
            //TODO change the endpoint 
            // const res = await fetch("localhost:3003/login", {
            //     method: "GET",
            //     headers: {
            //         "Content-type" : "application/json"
            //     },
            //     body: JSON.stringify({email, password})
            // });

            // nav("/");
        }
        catch {

        }
    }

    return (
        <FormProvider {...methods}>
            <form className="Container" noValidate onSubmit={submitForm}>
                <div className="formItem">
                    <label>Email</label>
                    <input type="text" placeholder="email" {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-z0-9]([A-z0-9._+]*)[A-z0-9]\@([A-z0-9._+]*\.)*(\w{2,4})$/,
                            message: "Invalid email address"
                        }
                    })}/>
                    {errors.email && (
                        <span className="error-message">{errors.email.message as string}</span>
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
                        <span className="error-message">{errors.password.message as string}</span>
                    )}
                </div>
                <button className="button">Login</button>
            </form>
        </FormProvider>
    )
}   