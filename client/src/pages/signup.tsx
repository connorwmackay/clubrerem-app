
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {Redirect} from "react-router-dom";

import { signupSlice, selectSignup, setUsername, setEmail, setPassword, setPasswordCheck, fetchCreateUser, SignupData } 
from '../features/signup';

import '../styles/Login.css'

const Signup = () => {
    let signup = useSelector(selectSignup);
    const dispatch = useDispatch();

    function handleUsername(event: React.FormEvent<HTMLInputElement>) {
        dispatch(setUsername(event.currentTarget.value));
    }
    
    function handlePassword(event: React.FormEvent<HTMLInputElement>) {
        dispatch(setPassword(event.currentTarget.value));
    }

    function handleEmail(event: React.FormEvent<HTMLInputElement>) {
        dispatch(setEmail(event.currentTarget.value));
    }
    
    function handlePasswordCheck(event: React.FormEvent<HTMLInputElement>) {
        dispatch(setPasswordCheck(event.currentTarget.value));
    }

    

    function submitSignup(event: React.FormEvent) {
        let data: SignupData = {
            username: signup.username,
            email: signup.email,
            password: signup.password
        }

        dispatch(fetchCreateUser(data));
        event.preventDefault();
    }

    const signupRedirect = () => {
        if (signup.is_signed_up) {
            return (
                <Redirect to='/login' />
            );
        } else {
            return (
                <></>
            );
        }
    }

    return (
        <div>
            <h1>Signup</h1>
            <form method="POST" autoComplete="off" onSubmit={submitSignup} id="loginForm">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" onChange={handleUsername} required/>

                <label htmlFor="email">Email</label>
                <input type="email" id="username" name="email" onChange={handleEmail} required/>

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={handlePassword} required/>

                <label htmlFor="passwordCheck">Password Check</label>
                <input type="password" id="password" name="passwordCheck" onChange={handlePasswordCheck} required/>

                <button type="submit" id="loginButton">Signup</button>
            </form>
            
            {signupRedirect()}
        </div>
    )
}

export default Signup