import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import requireAuth from './requireAuth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Protected extends Component {
    onSubmit = formProps => {
        
        this.props.updateUser(formProps, () => {
            console.log(formProps);
            console.log('submitted');
        });
    };

    render() {
        const { handleSubmit } = this.props;
        return(
            <Container>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>You are signed in. This is a protected route!</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <form onSubmit={handleSubmit(this.onSubmit)}>
                            <fieldset>
                                <label>Username</label>
                                <Field
                                    name="User"
                                    type="text"
                                    component="input"
                                    autoComplete="none"
                                />
                            </fieldset>
                            <button>Update!</button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

// export default requireAuth(Protected);

function mapStateToProps(state) {
    return { currentUser: state.user };
}
export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'updateUser' })
)(requireAuth(Protected));