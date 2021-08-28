import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import { selectFindUser, setTargetUsername, fetchUser } from '../features/findUser';

import '../styles/User.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UserParams {
    username: string;
}

const User = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const findUser = useSelector(selectFindUser);
    const dispatch = useDispatch();

    let params: UserParams = useParams();
    dispatch(setTargetUsername(params.username));
    
    const profile_url = "http://localhost:4001/res/images/default_profile.png";

    useEffect(() => {
        if (!findUser.isUserFound) {
            dispatch(fetchUser(findUser.targetUsername));
        }
    });

    if (findUser.isUserFound) {
        if (authenticatedUser.id === findUser.user.id) {
            return (
                <div className="profile">
                    <img src={findUser.user.profile_picture || profile_url} alt="User Profile" width="250" height="250" className="profile_picture" />
                    
                    <label htmlFor="profilePictureUpload" className="profile_picture_file_label">
                        <FontAwesomeIcon icon="camera"/>
                    </label>
                    <input type="file" name="profilePictureUpload" id="profilePictureUpload"/>
                    
                    <h1 className="username">{findUser.user.username}</h1>
                    <p>
                        
                    </p>
                    <button>Update</button>
                </div>
            )
        } else {
            return (
                <div className="profile">
                    <img src={findUser.user.profile_picture || profile_url} alt="User Profile" width="250" height="250" className="profile_picture" />
                    <h1 className="username">{findUser.user.username}</h1>
                    <p>
                        
                    </p>
                </div>
            )
        }
    } else {
        return (
            <div className="profile">
                <h1 className="username">{findUser.status}</h1>
            </div>
        );
    }
};

export default User