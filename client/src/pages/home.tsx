import React from 'react'
import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';

const Home = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);

    if (authenticatedUser.is_authenticated) {
        return (
            <div>
                <h1>Club ReRem</h1>
                <p>Hello, {authenticatedUser.username}!</p>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Club ReRem</h1>
            </div>
        )
    }
};


export default Home