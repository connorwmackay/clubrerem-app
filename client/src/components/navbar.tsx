import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser, unauthenticate, UserLoginData } from '../features/authenticatedUser';
import { toggleAccountMenu, selectNavbar, NavbarState } from "../features/navbar";
import { selectSearch, fetchFind, SearchResult, UserResult, resetSearchResults } from "../features/search";

import Cookies from "js-cookie";
import { useEffect } from "react";

export default function Navbar() {

    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const navbar = useSelector(selectNavbar);
    const search = useSelector(selectSearch);
    const dispatch = useDispatch();


    useEffect(() => {
        if ((Cookies.get('bearer_token') !== undefined && Cookies.get('username') !== 'undefined') && !authenticatedUser.is_authenticated) {
            let userData: UserLoginData = {
                username: '',
                password: '',
                save_password: false,
                is_signup: false
            }

            dispatch(fetchAuthenticatedUser(userData));
        }
    });

    const logout = () => {
        Cookies.remove('username');
        Cookies.remove('bearer_token');
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
                            <img src={`http://localhost:4001${authenticatedUser.profile_picture_url}`} alt="" width="30" height="30" className="nav-profile"/> {authenticatedUser.username}
                        </button>
                    </li>
                    {accountMenu(navbar.isAccountMenuOpen)}
                </>
            );
        }
    }

    const redirectToUser = () => {
        dispatch(resetSearchResults());
    }

    const searchResults = () => {
        if (search.searchResults.length > 0) {
            console.log("Results:", search.searchResults);

            let redirect: any = null;

            const searchItems: any = [];
            search.searchResults.forEach((result: SearchResult) => {
                searchItems.push(
                    <li className="searchResultItem">
                        <Link to={`/user/${result.user.username}`}>
                            <button className="navbar-button" onClick={redirectToUser}>
                                {redirect}
                                <img src={`http://localhost:4001${result.user.profile_picture}`} width="35" height="35" alt="User profile"/>
                                {' ' + result.user.username}
                            </button>
                        </Link>
                    </li>);
            });

            console.log("Search Items:", searchItems);

            return (<ul  className="searchResultItemList">{searchItems}</ul>);
        } else {
            return (
                <></>
            );
        }
    }

    const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(resetSearchResults())
        dispatch(fetchFind(event.currentTarget.value));
    }

    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="navbar-item">
                    <Link to="/" className="navbar-link">Club ReRem</Link>
                </li>
                <li>
                    <form className="searchBarForm" autoComplete="off">
                        <input type="text" placeholder="Search..." id="search" className="searchBarInput" onChange={handleSearch}/>
                    </form>
                </li>
                {searchResults()}
                {userElement()}
            </ul>
        </nav>
    );
}