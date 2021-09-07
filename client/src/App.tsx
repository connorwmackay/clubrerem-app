import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser, unauthenticate, UserLoginData } from './features/authenticatedUser';
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

// TODO: Create a separate navbar component and call <Navbar /> in App().

function App() {
    library.add(faCamera);
    
    return (
        <Router>
            <Navbar />

            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/user/:username">
                    <User />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
                <Route path="/friends">
                    <FriendList />
                </Route>
            </Switch>
        </Router>
    )
}

const mapDispatchToProps = {
    fetchAuthenticatedUser,
    unauthenticate,
    toggleAccountMenu,
    fetchUser,
}

export default connect(null, mapDispatchToProps)(App)