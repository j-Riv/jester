import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Signup extends Component {
    onSubmit = formProps => {
        this.props.signup(formProps, () => {
            this.props.history.push('/lobby');
        });
    };

    render() {
        const { handleSubmit } = this.props;

        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        Sign Up its free and always will be.
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="text-center">
                        <Form onSubmit={handleSubmit(this.onSubmit)}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Field
                                    className="form-control"
                                    name="email"
                                    type="text"
                                    component="input"
                                    autoComplete="none"
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Field
                                    className="form-control"
                                    name="username"
                                    type="text"
                                    component="input"
                                    autoComplete="none"
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Field
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    component="input"
                                    autoComplete="none"
                                />
                            </Form.Group>
                            <div>{this.props.errorMessage}</div>
                            <Button variant="secondary" type="submit" style={{ width: '100%' }}>
                                Sign Up!
                            </Button>
                            <Link to="/signin">You already have an account? Log in here.</Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup' })
)(Signup);