import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Home from '../components/Home/Home';
import Signout from './auth/Signout';
import EditProfile from "../components/Profile/EditProfile";
import GamesLobby from "../components/lobby/gamesLobby/lobby";
import Room from './Room/Game';
import "./App.css";

class App extends Component {

    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (!token || token === '') {//if there is no token, dont bother
            return;
        }
        // fetch user from token (if server deems it's valid token)
        this.props.getCurrentUser(token, (response) => {
            console.log(response);
        });
    }

    render() {
        return (
            <div className="site">
                <div className="site-content">
                    <Header />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/profile" component={EditProfile} />
                        <Route path="/lobby" component={GamesLobby} />
                        <Route path="/room/:gameId" component={Room} />
                        <Route path="/signout" component={Signout} />
                        <Route component={Home} />
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}

// export default App;
function mapStateToProps(state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose(
    connect(mapStateToProps, actions)
)(App);