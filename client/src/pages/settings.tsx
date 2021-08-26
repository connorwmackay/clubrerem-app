import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';

const Settings = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const dispatch = useDispatch();

    return (
        <form>
            <h1>Settings</h1>
            <label htmlFor="">Username</label>
            <input type="text" placeholder={authenticatedUser.username}/>

            <label htmlFor="">Email</label>
            <input type="text" placeholder={authenticatedUser.email}/>

            <label htmlFor="">Password</label>
            <input type="password" />

            <button type="submit">Update</button>
        </form>
    )
};

export default Settings;