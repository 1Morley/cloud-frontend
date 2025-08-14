import { useState } from "react";
import "../../styles/login.css";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {useNavigate} from "react-router-dom";

export default function SignUpForm(){
    const methods = useForm();
    const {register, handleSubmit, formState: { errors }} = methods;

    const submitForm = handleSubmit(data => {
        console.log("function ran")
        console.log(data.password);
    });

    //TODO i might need to write something to check if a username is unique
    return (
        <FormProvider {...methods}>
            <form onSubmit={submitForm} noValidate className="Container">
                <div className="formItem">
                    <label>First Name</label>
                    <input type="text" placeholder="first name" {...register("firstName", {
                        required: "First name is required",
                    })}/>
                    {errors.firstName && (
                        <span className="error-message">{errors.firstName.message as string}</span>
                    )}
                </div>
                <div className="formItem">
                    <label>Last Name</label>
                    <input type="text" placeholder="last name" {...register("lastName", {
                        required: "Last name is required"
                    })}/>
                    {errors.lastName && (
                        <span className="error-message">{errors.lastName.message as string}</span>
                    )}
                </div>
                <div className="formItem">
                    <label>Username</label>
                    <input type="text" placeholder="username" {...register("username", {
                        required: "Username is required"
                    })}/>
                    {errors.username && (
                        <span className="error-message">{errors.username.message as string}</span>
                    )}
                </div>
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
                <button className="button" type="submit">Sign Up</button>
            </form>
        </FormProvider>
    )
}
