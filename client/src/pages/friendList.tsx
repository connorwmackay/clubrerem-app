import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import authenticatedUser, { selectAuthenticatedUser } from '../features/authenticatedUser';
import { selectFriendList, fetchFriendList, resetFriendList, setUsername, setUserId, Friend} from "../features/friendsList";
import '../styles/FriendList.css'

const FriendList = () => {

    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const friendList = useSelector(selectFriendList);

    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticatedUser.is_authenticated) {
            if (friendList.user.id === -1) {
                dispatch(setUserId(authenticatedUser.id));
            }

            if (friendList.user.username === '') {
                dispatch(setUsername(authenticatedUser.username));
            }
        }

       if (!friendList.is_data_fetched && friendList.user !== {id: -1, username: ''}) {
           dispatch(fetchFriendList());
       }
    });

    const friendListElements = friendList.friends.map((friend: Friend) => {
        return <li key={friend.id} className="friendListItem">
            <Link to={`/user/${friend.username}`}>
                <img src={`http://localhost:4001${friend.profile_picture}`} alt="Profile" width="35" height="35"/>
                 {' ' + friend.username}
            </Link>
        </li>
    });

    return (
        <div>
            <h1>Friend List</h1>
            <ul className="friendList">
                {friendListElements}
            </ul>
        </div>
    )
}

export default FriendList;