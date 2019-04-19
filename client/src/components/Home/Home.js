import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import './home.css';

class Home extends Component {

    renderButtons() {
        if (this.props.authenticated) {
            return (
                <p className="text-center">
                    <Link to="/lobby" className="btn btn-secondary m-2">Play</Link>
                </p>
            );
        } else {
            return (
                <p className="text-center">
                    <Link to="/signin" className="btn btn-secondary m-2">Sign In</Link>
                    <Link to="/signup" className="btn btn-secondary m-2">Sign Up</Link>
                </p>
            );
        }
    }

    onSubmit = formProps => {
        this.props.signup(formProps, () => {
            this.props.history.push('/lobby');
        });
    };

    render() {
        return (
            <Container>
                <Jumbotron>
                    <div>
                        <img src="/images/jester-banner.jpg" alt="Jester" className="w-100" />
                        {this.renderButtons()}
                    </div>
                </Jumbotron>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
}

export default compose(
    connect(mapStateToProps),
)(Home);