import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './signinmodal.css';

class SigninModal extends React.Component {
    onSubmit = formProps => {
        this.props.signin(formProps, () => {
            this.props.showSignin(false);
            this.props.history.push('/lobby');
        });
    };

    render() {
        const { handleSubmit } = this.props;

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="signin-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.heading}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="mb-1" onSubmit={handleSubmit(this.onSubmit)}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
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
                        <Button variant="highlight" type="submit" style={{ width: '100%' }}>
                            Sign in
                        </Button>
                    </Form>
                </Modal.Body>
                <a className="text-center pb-2" href="#" onClick={this.props.onHide}>Don't have an account? Sign up here.</a>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signin' })
)(withRouter(SigninModal));