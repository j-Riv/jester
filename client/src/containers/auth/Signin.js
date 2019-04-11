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

class Signin extends Component {
    onSubmit = formProps => {
        this.props.signin(formProps, () => {
            this.props.history.push('/protected');
        });
    };

    render() {
        const { handleSubmit } = this.props;

        return (
            <Container>
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
                            <Button variant="secondary" type="submit" style={{width: '100%'}}>
                                Sign in
                            </Button>
                            <Link to="/signup">Don't have an account? Sign up here.</Link>
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
    reduxForm({ form: 'signin' })
)(Signin);
