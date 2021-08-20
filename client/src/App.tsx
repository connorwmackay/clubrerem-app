import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser, unauthenticate, UserLoginData } from './features/authenticatedUser';

import './styles/App.css'

import Home from './pages/home';
import Login from './pages/login';
import Cookies from "js-cookie";

function App() {

    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(unauthenticate());
    }

    const userElement = () => {
        let userData: UserLoginData = {
            username: '',
            password: '',
            save_password: false
        }

        if (Cookies.get('bearer_token') !== undefined && Cookies.get('username') !== 'undefined' && !authenticatedUser.is_authenticated) {
            dispatch(fetchAuthenticatedUser(userData));
        }

        if (!authenticatedUser.is_authenticated) {
            return (
                <>
                    <li className="navbar-item-right">
                        <Link to ="/signup" className="navbar-link">Signup</Link>
                    </li>
                    <li className="navbar-item-right">
                        <Link to ="/login" className="navbar-link">Login</Link>
                    </li>
                </>
            );
        } else {
            // List is rendered back to front due to float: right; style.
            return (
                <>
                    <li className="navbar-item-right">
                        <button className="navbar-button" onClick={logout}>Logout</button>
                    </li>
                    <li className="navbar-item-right">
                        <button className="navbar-button">{authenticatedUser.username}</button>
                    </li>
                   
                </>
            );
        }
    }

    return (
        <Router>
                <nav className="navbar">
                    <ul className="navbar-nav">
                        <li className="navbar-item">
                            <Link to="/" className="navbar-link">Home</Link>
                        </li>
                        {userElement()}
                    </ul>
                </nav>

                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
        </Router>
    )
}

const mapDispatchToProps = {
    fetchAuthenticatedUser,
    unauthenticate
}

export default connect(null, mapDispatchToProps)(App)