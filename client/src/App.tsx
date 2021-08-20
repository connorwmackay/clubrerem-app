import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchAuthenticatedUser, selectAuthenticatedUser, unauthenticate, UserLoginData } from './features/authenticatedUser';

import Home from './pages/home';
import Login from './pages/login';

function App() {

    const authenticatedUser = useSelector(selectAuthenticatedUser);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(unauthenticate());
    }

    const userElement = () => {
        if (!authenticatedUser.is_authenticated) {
            let userData: UserLoginData = {
                username: '',
                password: '',
                save_password: false
            }

            dispatch(fetchAuthenticatedUser(userData));

            return (
                <li>
                     <Link to ="/login">Login</Link>
                </li>
            );
        } else {
            return (
                <>
                    <li>
                        <Link to="/">{authenticatedUser.username}</Link>
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

                <hr />

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