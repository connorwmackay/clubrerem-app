import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import '../styles/User.css'
import { selectFindClub, fetchClub, resetClubState } from '../features/findClub';

interface ClubParams {
    uuid: string;
}

const Club = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const findClub = useSelector(selectFindClub);
    const dispatch = useDispatch();

    const params: ClubParams = useParams();

    useEffect(() => {
        console.log("Auth User:", authenticatedUser);
        dispatch(fetchClub(params.uuid));
    }, []);

    const joinPublicClub = () => {

    }

    const joinPrivateClub = () => {

    }

    let joinClubText: string;
    let joinClubFormSubmit: any;

    
    
    if (findClub.name !== '') {
        // Club Joining variables.
        if (findClub.is_public) {
            joinClubText = "Join";
            joinClubFormSubmit = joinPublicClub;
        } else {
            joinClubText = "Request";
            joinClubFormSubmit = joinPrivateClub;
        }

        if (findClub.owner.username === authenticatedUser.username) { // TODO: Add Cover photo
            return (
                <div>
                    <section className="mainBody">
                        <div className="profile">
                            <img src={`http://localhost:4001${findClub.profile_picture}`} alt="Profile" width="250" height="250" className="profile_picture"/>
                        </div>
                        <h1>{findClub.name}</h1>
                        <p>{findClub.description}</p>
                    </section>
                </div>
            );
        } else {
            return (
                <div>
                    <section className="mainBody">
                        <h1>{findClub.name}</h1>
                        <p>{findClub.description}</p>

                        <div className="profile">
                            <img src={`http://localhost:4001${findClub.profile_picture}`} alt="Profile" width="250" height="250" className="profile_picture"/>
                        </div>
                        

                        <form action="" onSubmit={joinClubFormSubmit}>
                            <button type="submit">{joinClubText}</button>
                        </form>
                    </section>
                </div>
            );
        }
    } else {
        return (
            <div>
                <section className="mainBody">
                    <h1>No Club Found</h1>
                    <p>Sorry, there isn't a club with that UUID.</p>
                </section>
            </div>
        )
    }
};

export default Club