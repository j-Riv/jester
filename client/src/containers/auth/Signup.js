import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Signup extends Component {
    onSubmit = formProps => {
        this.props.signup(formProps, () => {
            this.props.history.push('/protected');
        });
    };

    render() {
        const { handleSubmit } = this.props;

        return (
            <Container>
                <Row>
                    <Col sm={12} className="text-center">
                        <form onSubmit={handleSubmit(this.onSubmit)}>
                            <fieldset>
                                <label>Email</label>
                                <Field
                                    name="email"
                                    type="text"
                                    component="input"
                                    autoComplete="none"
                                />
                            </fieldset>
                            <fieldset>
                                <label>Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    component="input"
                                    autoComplete="none"
                                />
                            </fieldset>
                            <div>{this.props.errorMessage}</div>
                            <button>Sign Up!</button>
                        </form>
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