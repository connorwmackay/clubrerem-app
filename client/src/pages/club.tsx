import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import '../styles/User.css'
import '../styles/Club.css'
import { selectFindClub, fetchClub, resetClubState } from '../features/findClub';
import { selectJoinClub, fetchJoinClub } from '../features/joinClub';
import { selectFindClubMember, fetchFindClubMember } from '../features/findClubMember';
import { selectFindAllClubMembers, fetchAllClubMembers } from '../features/findAllClubMembers';

interface ClubParams {
    uuid: string;
}

enum ClubNavMenuItem {
    BULLETIN,
    CHAT,
    MEMBERS
};

const Club = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const findClub = useSelector(selectFindClub);
    const joinClub = useSelector(selectJoinClub);
    const findClubMember = useSelector(selectFindClubMember);
    const findAllClubMembers = useSelector(selectFindAllClubMembers);

    const dispatch = useDispatch();

    const params: ClubParams = useParams();

    const [currentMenuItem, setCurrentMenuItem] = useState(ClubNavMenuItem.MEMBERS);

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
                    width="35" height="35" /> {member.user.username}
                </a>
            </li>
        });

        const clubNavMenu = () => {

            let bulletinClasses = "club-nav-button";
            let chatClasses = "club-nav-button";
            let membersClasses = "club-nav-button" 

            switch(currentMenuItem) {
                case ClubNavMenuItem.BULLETIN:
                    bulletinClasses = "club-nav-button-current";
                    chatClasses = "club-nav-button";
                    membersClasses = "club-nav-button";
                    break;
                case ClubNavMenuItem.CHAT:
                    bulletinClasses = "club-nav-button";
                    chatClasses = "club-nav-button-current";
                    membersClasses = "club-nav-button";
                    break;
                case ClubNavMenuItem.MEMBERS:
                    bulletinClasses = "club-nav-button";
                    chatClasses = "club-nav-button";
                    membersClasses = "club-nav-button-current";
                    break;
            }

            const switchToBulletin = () => {
                setCurrentMenuItem(ClubNavMenuItem.BULLETIN);
            }

            const switchToChat = () => {
                setCurrentMenuItem(ClubNavMenuItem.CHAT);
            }

            const switchToMembers = () => {
                setCurrentMenuItem(ClubNavMenuItem.MEMBERS);
            }

            return (
                <nav className="club-nav">
                    <ul className="club-nav-list">
                        <li className="club-nav-item">
                            <button className={bulletinClasses} onClick={switchToBulletin}>Bulletin</button>
                        </li>
                        <li className="club-nav-item">
                            <button className={chatClasses} onClick={switchToChat}>Chat</button>
                        </li>
                        <li className="club-nav-item">
                            <button className={membersClasses} onClick={switchToMembers}>Members</button>
                        </li>
                    </ul>
                </nav>
            );
        };

        const clubMemberList = () => {
            return (
                <ul className="member-list">
                    <li key={findClub.owner.id}>
                        <a href={`http://localhost:3000/user/${findClub.owner.username}`}>
                            <img src={`http://localhost:4001${findClub.owner.profile_picture}`} alt="Profile"
                            width="35" height="35" /> {findClub.owner.username}
                        </a>
                    </li>

                    {memberListItems}
                </ul>
            )
        };

        const clubContent = () => {
            switch(currentMenuItem) {
                case ClubNavMenuItem.BULLETIN:
                    return (
                        <div>
                        {clubNavMenu()}
                         <h2 className="club-sub-header">Bulletin</h2>
                    </div>
                    );
                case ClubNavMenuItem.CHAT:
                    return (
                        <div>
                            {clubNavMenu()}
                             <h2 className="club-sub-header">Chat</h2>
                        </div>
                    );
                case ClubNavMenuItem.MEMBERS:
                    return (
                        <div>
                            {clubNavMenu()}
                             <h2 className="club-sub-header">Members</h2>
                            {clubMemberList()}
                        </div>
                    );
            }
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
                        
                        {clubContent()}
                        
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

                        {clubContent()}
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