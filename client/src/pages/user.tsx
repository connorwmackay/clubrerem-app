import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from '../features/authenticatedUser';
import { useParams } from 'react-router';

import { selectFindUser, setTargetUsername, fetchUser } from '../features/findUser';

import '../styles/User.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { selectUpdateProfile, setDescription, fetchSendPicture, fetchUpdateProfile } from '../features/profileUpdate';

interface UserParams {
    username: string;
}

const User = () => {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const updateProfile = useSelector(selectUpdateProfile);
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

    const handleDescription = (event: React.FormEvent<HTMLTextAreaElement>) => {
        dispatch(setDescription(event.currentTarget.value));
    }

    const handleProfileFile = (event: React.FormEvent<HTMLInputElement>) => {
        const formData: FormData = new FormData();

        if (event.currentTarget.files) {
            formData.append('image', event.currentTarget.files[0]);
        }

        dispatch(fetchSendPicture(formData));
    }

    const submitUpdateProfile = () => {
        dispatch(fetchUpdateProfile({description: updateProfile.description, profile_picture: updateProfile.profileUrl}));
    }

    const profileImage = () => {
        if (updateProfile.profileUrl) {
            return (
                <img src={'http://localhost:4001' + updateProfile.profileUrl} alt="User Profile" width="250" height="250" className="profile_picture" />
            )
        } else {
            return (
                <img src={findUser.user.profile_picture || profile_url} alt="User Profile" width="250" height="250" className="profile_picture" />
            )
        }   
    }

    const profileUpdateStatus = () => {
        if (updateProfile.isUpdated) {
            return (
                <p>
                    Updated profile.
                </p>
            )
        } else {
            return (
                <></>
            )
        }
    }

    if (findUser.isUserFound) {
        if (authenticatedUser.id === findUser.user.id) {
            return (
                <div className="profile">
                    <div className="profilePictureContainer">
                        {profileImage()}
                        <label htmlFor="profilePictureUpload" className="profile_picture_file_label">
                        <FontAwesomeIcon icon="camera"/>
                        </label>
                        <input type="file" name="profilePictureUpload" id="profilePictureUpload" onChange={handleProfileFile}/>
                    </div>
                    
                    <h1 className="username">{findUser.user.username}</h1>
                    <textarea placeholder={findUser.user.description} className="description" maxLength={255} 
                    onChange={handleDescription}></textarea>
                    <button onClick={submitUpdateProfile}>Update</button>
                    {profileUpdateStatus()}
                </div>
            )
        } else {
            return (
                <div className="profile">
                    <img src={findUser.user.profile_picture || profile_url} alt="User Profile" width="250" height="250" className="profile_picture" />
                    <h1 className="username">{findUser.user.username}</h1>
                    <p>
                        {findUser.user.description}
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