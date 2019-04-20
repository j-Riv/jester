import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './header.css';

class Header extends Component {

    handleShowSignin = () => {
        console.log('show modal');
        this.props.showSignin(true);
    }

    renderLinks() {
        if (this.props.authenticated) {
            return (
                <div>
                    <Link to="/lobby">Lobby</Link>
                    <Link to="/signout">Sign Out</Link>
                </div>
            );
        } else {
            return (
                <div>
                    <a href="#" onClick={this.handleShowSignin}>Log In</a>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="header">
                <Link to="/" className="logo"><img src="/images/jester-logo-black.png" alt="Jester" /></Link>
                {this.renderLinks()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        showSigninForm: state.auth.showSignin,
        authenticated: state.auth.authenticated
    };
}

export default connect(mapStateToProps, actions)(Header);