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

import Cookies from "js-cookie";

import { toggleAccountMenu, selectNavbar, NavbarState } from "./features/navbar";

import './styles/App.css'

import Home from './pages/home';
import Login from './pages/login';
import User from './pages/user';
import Navbar from './components/navbar';
import Settings from './pages/settings';

// TODO: Create a separate navbar component and call <Navbar /> in App().

function App() {
    
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
                <Route path="/user/:username">
                    <User />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
            </Switch>
        </Router>
    )
}

const mapDispatchToProps = {
    fetchAuthenticatedUser,
    unauthenticate,
    toggleAccountMenu
}

export default connect(null, mapDispatchToProps)(App)