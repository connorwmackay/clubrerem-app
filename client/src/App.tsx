import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { connect, useSelector, useDispatch } from 'react-redux';
import authenticatedUser, { fetchAuthenticatedUser, selectAuthenticatedUser, unauthenticate, UserLoginData } from './features/authenticatedUser';
import { selectFindUser, fetchUser, resetUserState } from "./features/findUser";

import Cookies from "js-cookie";

import { toggleAccountMenu, selectNavbar, NavbarState } from "./features/navbar";

import './styles/App.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

import Home from './pages/home';
import Login from './pages/login';
import User from './pages/user';
import Navbar from './components/navbar';
import Settings from './pages/settings';
import Signup from './pages/signup';
import FriendList from './pages/friendList';
import Club from './pages/club';
import CreateClub from './pages/createClub';

import {selectFriendList, setUsername, setUserId, fetchFriendList, Friend} from "./features/friendsList";
import {selectClubList, fetchClubList} from "./features/ClubList";

// TODO: Create a separate navbar component and call <Navbar /> in App().

function App() {
    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const friendList = useSelector(selectFriendList);
    const clubList = useSelector(selectClubList);
    const dispatch = useDispatch();

    library.add(faCamera);

    useEffect(() => {
        if (authenticatedUser.is_authenticated && friendList.user.id === -1) {
            dispatch(setUsername(authenticatedUser.username));
            dispatch((setUserId(authenticatedUser.id)));
        }
    });

    // TODO: Put friendRequestComponent into its own component in components folder
    const friendRequestComponent = () => {

        if (!friendList.is_data_fetched) {
            dispatch(fetchFriendList());

            return (
                <div className="sidebar-card">
                    <h2 className="sidebar-card-title">Friend Requests</h2>
                    <p className="sidebar-card-text">Loading...</p>
                </div>
            )
        } else {
            const friendRequestList = friendList.friends.map((friend: Friend) => {
                if (friend.is_requested === 0 && friend.is_friend === 2 && friend.id !== authenticatedUser.id) {
                    console.log("Friend Request");
                    return <li className="sidebar-card-list-item">
                        <Link to={`/user/${friend.username}`} className="sidebar-card-list-item">
                            <img src={`http://localhost:4001${friend.profile_picture}`} alt="Profile" width="25" height="25"/>
                            {' ' + friend.username + ' '}
                        </Link>
                    </li>
                }
            });

            if (friendRequestList.length <= 0) {
                 return (
                     <div className="sidebar-card">
                         <h2 className="sidebar-card-title">Friend Requests</h2>
                         <p className="sidebar-card-text">
                             You don't have any friend requests.
                         </p>
                     </div>
                 )
            } else {
                return (
                    <div className="sidebar-card">
                        <h2 className="sidebar-card-title">Friend Requests</h2>
                        <ul className="sidebar-card-list">
                            {friendRequestList}
                        </ul>
                    </div>
                )
            }
        }
    }

    const clubComponent = () => {
        if (!clubList.is_data_fetched) {
            const user = {
                id: authenticatedUser.id,
                username: authenticatedUser.username
            }

            dispatch(fetchClubList(user));

            return (
                <div className="sidebar-card">
                <h2 className="sidebar-card-title">Clubs</h2>
                <p className="sidebar-card-text">
                    Loading...
                </p>
               
                <ul className="sidebar-card-list">

                </ul>
            </div>
            )
        } else if (clubList.clubs.length > 0) {
            const clubListList = clubList.clubs.map((club: any) => {
                    return <li className="sidebar-card-list-item">
                        <Link to={`/club/${club.uuid}`} className="sidebar-card-list-item">
                            <img src={`http://localhost:4001${club.profile_picture}`} alt="Profile" width="25" height="25"/>
                            {' ' + club.name + ' '}
                        </Link>
                    </li>
            });

            return (
                <div className="sidebar-card">
                    <h2 className="sidebar-card-title">Clubs</h2>
                    <ul className="sidebar-card-list">
                        {clubListList}
                    </ul>
                    <p className="sidebar-card-text">
                        <button>
                            <Link to="/create-club">
                                Create
                            </Link>
                        </button>
                    </p>
                </div>
            )
        } else {
            return (
                <div className="sidebar-card">
                    <h2 className="sidebar-card-title">Clubs</h2>
                    <p className="sidebar-card-text">
                        You haven't joined any clubs. <br /> <br />
                        <button>
                            <Link to="/create-club">
                                Create
                            </Link>
                        </button>
                    </p>
                   
                    <ul className="sidebar-card-list">
    
                    </ul>
                </div>
            )
        }
        
    }

    if (authenticatedUser.is_authenticated) {
        return (
            <Router>
                <Navbar/>

                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/signup">
                        <Signup/>
                    </Route>
                    <Route path="/user/:username">
                        <User/>
                    </Route>
                    <Route path="/settings">
                        <Settings/>
                    </Route>
                    <Route path="/friends">
                        <FriendList/>
                    </Route>
                    <Route path="/club/:uuid">
                        <Club />
                    </Route>
                    <Route path="/create-club">
                        <CreateClub />
                    </Route>
                </Switch>

                <section className="sidebar">
                    {clubComponent()}
                    {friendRequestComponent()}
                </section>
            </Router>
        )
    } else {
        return (
                <Router>
                    <Navbar/>

                    <Switch>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/signup">
                            <Signup/>
                        </Route>
                        <Route path="/user/:username">
                            <User/>
                        </Route>
                        <Route path="/club/:uuid">
                            <Club />
                        </Route>
                    </Switch>
                </Router>
            )
    }
}

const mapDispatchToProps = {
    fetchAuthenticatedUser,
    unauthenticate,
    toggleAccountMenu,
    fetchUser,
}

export default connect(null, mapDispatchToProps)(App)