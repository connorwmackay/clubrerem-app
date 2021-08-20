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
                <li>
                     <Link to ="/login">Login</Link>
                </li>
            );
        } else {
            return (
                <>
                    <li>
                        <button>{authenticatedUser.username}</button>
                    </li>
                    <li>
                        <button onClick={logout}>Logout</button>
                    </li>
                </>
            );
        }
    }

    return (
        <Router>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
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