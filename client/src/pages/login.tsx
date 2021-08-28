
import { selectAuthenticatedUser, UserLoginData, fetchAuthenticatedUser } from '../features/authenticatedUser'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {Redirect} from "react-router-dom";

import '../styles/Login.css'

const Login = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [savePassword, setSavePassword] = useState(false);

    function handleUsername(event: React.FormEvent<HTMLInputElement>) {
        setUsername(event.currentTarget.value);
    }
    
    function handlePassword(event: React.FormEvent<HTMLInputElement>) {
        setPassword(event.currentTarget.value);
    }

    function handleSavePassword(event: React.FormEvent<HTMLInputElement>) {
        if (event.currentTarget.checked) {
            setSavePassword(true);
        } else {
            setSavePassword(false);
        }
    }

    function submitLogin(event: React.FormEvent) {

        const loginData: UserLoginData = {
            username: username,
            password: password,
            save_password: savePassword,
            is_signup: true
        };
        
        dispatch(fetchAuthenticatedUser(loginData));

        event.preventDefault();
    }

    const loginRedirect = () => {
        if (authenticatedUser.is_authenticated) {
            return (
                <Redirect to="/" />
            )
        } else {
            return (
                <>
                </>
            )
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form method="GET" autoComplete="off" id="loginForm">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" onChange={handleUsername} required/>

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={handlePassword} required/>
                <div id="savePasswordSection">
                    <label htmlFor="savePassword">Save Password</label>
                    <input type="checkbox" id="savePassword" name="savePassword" checked={savePassword} onChange={handleSavePassword} />
                </div>

                <button type="submit" id="loginButton" onClick={submitLogin}>Login</button>
                {authenticatedUser.status}
                {loginRedirect()}
            </form>

            
        </div>
    )
}

export default Login