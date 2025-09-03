import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { FormProvider, useForm} from "react-hook-form";
import "../../styles/login.css";
import { AuthFlowType, CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getSecretHash } from "../../utils/hash";

export default function LoginForm(){
    const nav = useNavigate();
    const methods = useForm();
    const {register, handleSubmit, formState: { errors }} = methods;
   const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
    const clientId = "79djcu7dlr9fs3tds5hf53fsoj";
    const clientSecret = "16samauoorblf4pmk71ceoirkju2bgs61t0c4akase452a0b3dgb";   

    async function submitForm(data) {
        let hash = await getSecretHash(clientId, clientSecret, data.username)

        try {
            const command = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: {
                USERNAME: data.username,
                PASSWORD: data.password,
                SECRET_HASH: hash
            },
            ClientId: clientId,
            });

            const res = await client.send(command);

            if (res.AuthenticationResult) {
                localStorage.setItem("SessionInformation", JSON.stringify(res.AuthenticationResult));
                nav("/");
            } 
            else {
                console.error("Unexpected response:", res);
            }

        } catch (err) {
            throw err
        }
    }


    return (
        <FormProvider {...methods}>
            <form className="container" noValidate onSubmit={handleSubmit(submitForm)}>
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