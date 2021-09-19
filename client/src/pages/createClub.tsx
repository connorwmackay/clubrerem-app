import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import '../styles/Home.css';

const CreateClub = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);

    return (
        <div>
            <section className="mainBody">
                <h1>Create Club</h1>
                <form action="">
                    <label htmlFor="clubName">Name</label>
                    <input type="text" id="clubName"/>

                    <label htmlFor="clubDesc">Description</label>
                    <input type="text" id="clubDesc"/>

                    <label htmlFor="clubName">Is Public?</label>
                    <input type="checkbox" id="clubName"/>

                    <button type="submit">Create</button>
                </form>
            </section>
        </div>
    )
}

export default CreateClub;