import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import '../styles/Home.css'
import { selectFindClub, fetchClub, resetClubState } from '../features/findClub';

interface ClubParams {
    uuid: string;
}

const Club = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const findClub = useSelector(selectFindClub);
    const params: ClubParams = useParams();

    useEffect(() => {
        if (findClub.uuid !== params.uuid) {
            resetClubState();
        }

        if (!findClub.is_club_found) {
            fetchClub(params.uuid);
        }
    });

    const joinPublicClub = () => {

    }

    const joinPrivateClub = () => {

    }

    let joinClubText: string;
    let joinClubFormSubmit: any;

    // Club Joining variables.
    if (findClub.is_public) {
        joinClubText = "Join";
        joinClubFormSubmit = joinPublicClub;
    } else {
        joinClubText = "Request";
        joinClubFormSubmit = joinPrivateClub;
    }
    
    if (findClub.is_club_found) {
        return (
            <div>
                <section className="mainBody">
                    <h1>{findClub.name}</h1>
                    <p>{findClub.description}</p>

                    <img src={`http:localhost:4000${findClub.profile_picture}`} alt="Profile" width="250" height="250" className="profile_picture" />

                    <form action="" onSubmit={joinClubFormSubmit}>
                        <button type="submit">{joinClubText}</button>
                    </form>
                </section>
            </div>
        );
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