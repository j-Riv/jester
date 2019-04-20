import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import SigninModal from '../SigninModal/SigninModal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Signout extends Component {

    componentDidMount() {
        document.body.classList.add('home');
        this.props.signout();
    }

    componentWillUnmount = () => {
        document.body.classList.remove('home');
    } 

    render() {
        const closeSignin = () => this.props.showSignin(false);
        return (
            <Container>
                <SigninModal
                    show={this.props.showSigninForm}
                    onHide={closeSignin}
                    heading={<img src="/images/jester-logo-white.png" alt="Jester" />}
                />
                <Row>
                    <Col sm={12} className="text-center text-white">
                        <h3>You have been logged out.</h3>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        showSigninForm: state.auth.showSignin
    };
}

export default connect(mapStateToProps, actions)(Signout);