import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../components/Home';
import Signup from './auth/Signup';
import Protected from '../components/Protected';
import Signout from './auth/Signout';
import Signin from './auth/Signin';
import Chat from './Chat';
import "./App.css";

class App extends Component {
    render() {
        return (
            <div className="site">
                <div className="site-content">
                    <Header />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/protected" component={Protected} />
                        <Route path="/signout" component={Signout} />
                        <Route path="/signin" component={Signin} />
                        <Route path="/chat" component={Chat} />
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;