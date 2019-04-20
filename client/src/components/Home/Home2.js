import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import skipHome from '../../containers/skipHome'
import SigninModal from './SigninModal';
import './home.css';

class Home extends Component {

    componentDidMount = () => {
        document.body.classList.add('home');
    }
    
    componentWillUnmount = () => {
        document.body.classList.remove('home');
    } 

    handleShowSignin = () => {
        console.log('show modal');
        // this.setState({ showSignin: true });
        this.props.showSignin(true);
    }

    onSubmit = formProps => {
        this.props.signup(formProps, () => {
            this.props.history.push('/lobby');
        });
    };

    render() {
        const { handleSubmit } = this.props;
        const closeSignin = () => this.props.showSignin(false);

        return (
            <Container>
                <SigninModal
                    show={this.props.showSigninForm}
                    onHide={closeSignin}
                    heading={"Sign In"}
                />
                <Jumbotron>
                    <Row id="formWrapper">
                        <Col id="formImage" className="d-none d-md-block" md={6} style={{ backgroundImage: `url(/images/jester-banner.jpg)` }}>
                            {/* <img src="/images/jester-banner.jpg" alt="Jester" className="w-100" /> */}
                        </Col>
                        <Col sm={12} md={6}>
                            <div id="formLogo">
                                <img src="/images/jester-color-logo.png" alt="Jester" />
                            </div>
                            <Form className="text-center" onSubmit={handleSubmit(this.onSubmit)}>
                                <Form.Group controlId="email">
                                    <Field
                                        className="form-control"
                                        name="email"
                                        type="text"
                                        component="input"
                                        autoComplete="none"
                                        placeholder="Email"
                                    />
                                </Form.Group>

                                <Form.Group controlId="username">
                                    <Field
                                        className="form-control"
                                        name="username"
                                        type="text"
                                        component="input"
                                        autoComplete="none"
                                        placeholder='username'
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Field
                                        className="form-control"
                                        name="password"
                                        type="password"
                                        component="input"
                                        autoComplete="none"
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <div>{this.props.errorMessage}</div>
                                <Button variant="light" type="submit" style={{ width: '100%' }}>
                                    Sign Up!
                                </Button>
                                <a href="#" onClick={this.handleShowSignin}>You already have an account? Log in here.</a>
                            </Form>
                        </Col>
                    </Row>
                </Jumbotron>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return { 
        showSigninForm: state.auth.showSignin,
        authenticated: state.auth.authenticated,
        errorMessage: state.auth.errorMessage
    };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup' })
)(skipHome(Home));