import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './header.css';

class Header extends Component {

    handleShowSignin = () => {
        this.props.showSignin(true);
    }

    renderLinks() {
        if (this.props.authenticated) {
            return (
                <div>
                    <Link to="/lobby">LOBBY</Link>
                    <Link to="/signout">SIGN OUT</Link>
                </div>
            );
        } else {
            return (
                <div>
                    <span onClick={this.handleShowSignin}>LOG IN</span>
                </div>
            );
        }
    }

    renderLogo() {
        if (window.location.pathname === '/' || window.location.pathname === '/signout' || window.location.pathname === '/room') {
            return '/images/jester-logo-white.png';
        }else{
            return '/images/jester-logo-black.png';
        }
    }

    render() {
        return (
            <div className="header mb-4">
                <Link to="/" className="logo"><img src={'/images/jester-logo-white.png'} alt="Jester" /></Link>
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