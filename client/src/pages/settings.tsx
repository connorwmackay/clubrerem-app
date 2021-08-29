import Cookies from 'js-cookie';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';
import { selectUpdateUser, setUsername, setEmail, setPassword, fetchUpdateUser } from '../features/updateUser';

const Settings = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const updateUser = useSelector(selectUpdateUser);
    const dispatch = useDispatch();

    const handleUsername = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(setUsername(event.currentTarget.value));
    }

    const handleEmail = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(setEmail(event.currentTarget.value));
    }

    const handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(setPassword(event.currentTarget.value));
    }

    const submitUpdateUser = () => {
        console.log(updateUser);
        dispatch(fetchUpdateUser(updateUser));

        if (updateUser.username !== Cookies.get('username') && updateUser.username !== '') {
            Cookies.set('username', updateUser.username);
        }
    }

    return (
        <form method="PUT" autoComplete="off">
            <h1>Settings</h1>
            <label htmlFor="">Username</label>
            <input type="text" placeholder={authenticatedUser.username} name="username" id="username" onChange={handleUsername}/>

            <label htmlFor="">Email</label>
            <input type="text" placeholder={authenticatedUser.email} name="email" id="email" onChange={handleEmail}/>

            <label htmlFor="">Password</label>
            <input type="password" id="password" name="password" onChange={handlePassword} />

            <button type="submit" onClick={submitUpdateUser}>Update</button>
        </form>
    )
};

export default Settings;