import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Home from './Home/Home';
import Signout from './auth/Signout';
import GamesLobby from './Lobby/GamesLobby/Lobby';
import Room from './Room/Game';
import "./App.css";

class App extends Component {

    render() {
        return (
            <div className="site">
                <div className="site-content">
                    <Header />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/lobby" component={GamesLobby} />
                        <Route path="/room/:gameId" component={Room} key={window.location.pathname}/>
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