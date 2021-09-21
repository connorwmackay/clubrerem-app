import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import '../styles/User.css'
import { selectFindClub, fetchClub, resetClubState } from '../features/findClub';
import { selectJoinClub, fetchJoinClub } from '../features/joinClub';
import { selectFindClubMember, fetchFindClubMember } from '../features/findClubMember';
import { selectFindAllClubMembers, fetchAllClubMembers } from '../features/findAllClubMembers';

interface ClubParams {
    uuid: string;
}

const Club = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const findClub = useSelector(selectFindClub);
    const joinClub = useSelector(selectJoinClub);
    const findClubMember = useSelector(selectFindClubMember);
    const findAllClubMembers = useSelector(selectFindAllClubMembers);

    const dispatch = useDispatch();

    const params: ClubParams = useParams();

    useEffect(() => {
        if (!findClub.is_club_found) {
            dispatch(fetchClub(params.uuid));
        }

        if (!findAllClubMembers.is_data_fetched) {
            dispatch(fetchAllClubMembers(params.uuid));
        }
    }, []);

    useEffect(() => {
        if (authenticatedUser.is_authenticated && !findClubMember.is_member_found) {
            dispatch(fetchFindClubMember({clubUuid: params.uuid, username: authenticatedUser.username}));
        }
    });

    const joinClubFunc = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(fetchJoinClub(params.uuid));
    }

    let joinClubText: string;

    if (findClub.is_club_found) {
        // Club Joining variables.
        if (findClub.is_public) {
            joinClubText = "Join";
        } else {
            joinClubText = "Request";
        }

        const memberListItems = findAllClubMembers.clubMembers.map((member: any) => {
            console.log("Member: ", member);

            return <li key={member.id}>
                <a href={`http://localhost:3000/user/${member.user.username}`}>
                    <img src={`http://localhost:4001${member.user.profile_picture}`} alt="Profile"
                    width="25" height="25" />
                    {member.user.username}
                </a>
            </li>
        });

        if (findClub.owner.username === authenticatedUser.username) { // TODO: Add Cover photo
            return (
                <div>
                    <section className="mainBody">
                        <div className="profile">
                            <img src={`http://localhost:4001${findClub.profile_picture}`} alt="Profile" width="250" height="250" className="profile_picture"/>
                        </div>
                        <h1>{findClub.name}</h1>
                        <p>{findClub.description}</p>
                        <ul>
                            {memberListItems}
                        </ul>
                    </section>
                </div>
            );
        }
        
        if (findClubMember.is_member) {
            return (
                <div>
                    <section className="mainBody">
                        <div className="profile">
                            <img src={`http://localhost:4001${findClub.profile_picture}`} alt="Profile" width="250" height="250" className="profile_picture"/>
                        </div>
                        
                        <h1>{findClub.name}</h1>
                        <p>{findClub.description}</p>
                        <ul>
                            <li key={findClub.owner.id}>
                                <a href={`http://localhost:3000/user/${findClub.owner.username}`}>
                                    <img src={`http://localhost:4001${findClub.owner.profile_picture}`} alt="Profile"
                                    width="25" height="25" />
                                    {findClub.owner.username}
                                </a>
                            </li>

                            {memberListItems}
                        </ul>
                    </section>
                </div>
            )
        } else {
            return (
                <div>
                    <section className="mainBody">
                        <div className="profile">
                            <img src={`http://localhost:4001${findClub.profile_picture}`} alt="Profile" width="250" height="250" className="profile_picture"/>
                        </div>
                        
                        <h1>{findClub.name}</h1>
                        <p>{findClub.description}</p>

                        <form onSubmit={joinClubFunc}>
                            <button type="submit">{joinClubText}</button>
                        </form>

                        <ul>
                            {memberListItems}
                        </ul>
                    </section>
                </div>
            );
        }
    }

    return (
        <div>
            <section className="mainBody">
                <h1>No Club Found</h1>
                <p>Sorry, there isn't a club with that UUID.</p>
            </section>
        </div>
    )
};

export default Club;