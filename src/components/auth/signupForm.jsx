import "../../styles/login.css";
import { FormProvider, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import { getSecretHash } from "../../utils/hash";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export default function SignUpForm(){
    const methods = useForm();
    const {register, handleSubmit, formState: { errors }} = methods;
    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
    const clientId = "79djcu7dlr9fs3tds5hf53fsoj";
    const clientSecret = "16samauoorblf4pmk71ceoirkju2bgs61t0c4akase452a0b3dgb";   


    //TODO i might need to remove email
    async function submitForm(data) {
        let hash = await getSecretHash(clientId, clientSecret, data.username)

        try {
            const command = new SignUpCommand({
                ClientId: clientId,
                SecretHash: hash,
                Username: data.username,
                Password: data.password,
                UserAttributes: [{Name: "email", Value: data.email}]
            })

            const response = await client.send(command)
            console.log(response)
            return response
        }
        catch(err) {
            throw err
        }
    }

    //TODO i might need to write something to check if a username is unique
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)} noValidate className="container">
                <div className="formItem">
                    <label>First Name</label>
                    <input type="text" placeholder="first name" {...register("firstName", {
                        required: "First name is required",
                    })}/>
                    {errors.firstName && (
                        <span className="error-message">{errors.firstName.message}</span>
                    )}
                </div>
                <div className="formItem">
                    <label>Last Name</label>
                    <input type="text" placeholder="last name" {...register("lastName", {
                        required: "Last name is required"
                    })}/>
                    {errors.lastName && (
                        <span className="error-message">{errors.lastName.message}</span>
                    )}
                </div>
                <div className="formItem">
                    <label>Username</label>
                    <input type="text" placeholder="username" {...register("username", {
                        required: "Username is required",
                         pattern: {
                            value: /^[A-Za-z0-9_.@+-]+$/,
                            message: "Invalid username"
                        }
                    })}/>
                    {errors.username && (
                        <span className="error-message">{errors.username.message}</span>
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
                <button className="button" type="submit">Sign Up</button>
            </form>
        </FormProvider>
    )
}