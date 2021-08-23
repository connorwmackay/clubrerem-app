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

// TODO: Create a separate navbar component and call <Navbar /> in App().

function App() {

    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const navbar = useSelector(selectNavbar);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(unauthenticate());
    }

    const toggleMenu = () => {
        dispatch(toggleAccountMenu());
    }

    const accountMenu = (isOpen: boolean) => {
        if (isOpen) {
            return (
                <div className="accountMenu">
                    <ul className="accountMenuList">
                        <li className="accountMenuItem">
                            <Link to={`/user/${authenticatedUser.username}`}>
                                <button className="accountMenuButton" onClick={toggleMenu}>Profile</button>
                            </Link>
                        </li>
                        <li className="accountMenuItem">
                            <Link to="/settings">
                                <button className="accountMenuButton" onClick={toggleMenu}>Settings</button>
                            </Link>
                        </li>
                        <li className="accountMenuItem">
                            <hr />
                        </li>
                        <li className="accountMenuItem">
                            <button onClick={logout} className="accountMenuButton">Logout</button>
                        </li>
                    </ul>
                </div>
            );
        } else {
            return (
                <></>
            );
        }
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
            return (
                <>
                    <li className="navbar-item-right">
                        
                        <button className="navbar-button" onClick={toggleMenu}>
                            <img src={`http://localhost:4001${authenticatedUser.profile_picture_url}`} alt="" width="30" height="30"/> {authenticatedUser.username}
                            </button>
                    </li>
                    {accountMenu(navbar.isAccountMenuOpen)}
                </>
            );
        }
    }

    const submitSearch = (e: React.FormEvent) => {
        // TODO: Implement search functionality on search bar
        // Commented out so that input resets, this should be done via state updating
        // in the future.
        //e.preventDefault();
    };
    
    return (
        <Router>
                <nav className="navbar">
                    <ul className="navbar-nav">
                        <li className="navbar-item">
                            <Link to="/" className="navbar-link">Club ReRem</Link>
                        </li>
                        <li>
                            <form className="searchBarForm" autoComplete="off" onSubmit={submitSearch}>
                                <input type="text" placeholder="Search..." className="searchBarInput"/>
                            </form>
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
                    <Route path="/user/:username">
                        <User />
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