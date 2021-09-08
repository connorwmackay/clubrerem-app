import React from 'react'
import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';

import '../styles/Home.css'

const Home = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);

    return (
        <div>
            <section className="mainBody">
                <h1>Club ReRem</h1>
            </section>
        </div>
    )
};


export default Home