import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import '../styles/Home.css';
import { selectCreatelub, fetchCreateClub, CreateClubState,setName, setIsPublic,setDescription } from '../features/createClub';

const CreateClub = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const createClub = useSelector(selectCreatelub);
    const dispatch = useDispatch();

    const submitCreateClub = (event: React.FormEvent) => {
        console.log("Create Club: ", createClub);
        event.preventDefault();
        console.log("Submitting create club...")

        dispatch(fetchCreateClub({
            name: createClub.name,
            description: createClub.description,
            is_public: createClub.is_public,
        }));
    }

    const handleName = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(setName(event.currentTarget.value));
    }

    const handleDescription = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(setDescription(event.currentTarget.value));
    }

    const handleIsPublic = (event: React.FormEvent<HTMLInputElement>) => {
        if (event.currentTarget.value === "on") {
            dispatch(setIsPublic(true));
        } else {
            dispatch(setIsPublic(false));
        }
        
    }

    return (
        <div>
            <section className="mainBody">
                <h1>Create Club</h1>
                <form onSubmit={submitCreateClub}>
                    <label htmlFor="clubName">Name</label>
                    <input type="text" id="clubName" onChange={handleName}/>

                    <label htmlFor="clubDesc">Description</label>
                    <input type="text" id="clubDesc" onChange={handleDescription}/>

                    <label htmlFor="clubName">Is Public?</label>
                    <input type="checkbox" id="clubName" onChange={handleIsPublic}/>

                    <button type="submit">Create</button>
                </form>
                <p>{createClub.status}</p>
            </section>
        </div>
    )
}

export default CreateClub;