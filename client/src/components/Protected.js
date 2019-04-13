import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import requireAuth from '../containers/requireAuth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Protected extends Component {
    onSubmit = formProps => {
        formProps.id = this.props.currentUser._id;
        console.log(formProps);
        this.props.updateUser(formProps, () => {
            console.log('submitted');
        });
    };

    handleNewGame = () => {
        this.props.createGame((response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/game/' + game._id);
        });
    }

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
                        <h2>Current User Info:</h2>
                        <p>{this.props.currentUser.email}</p>
                        <p>{this.props.currentUser.username}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <form onSubmit={handleSubmit(this.onSubmit)}>
                            <fieldset>
                                <label>Username</label>
                                <Field
                                    name="username"
                                    type="text"
                                    component="input"
                                    autoComplete="none"
                                    placeholder={this.props.currentUser.username}
                                />
                            </fieldset>
                            <button>Update!</button>
                        </form>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Button variant="secondary" className="mt-3" onClick={this.handleNewGame}>New Chat</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

// export default requireAuth(Protected);

function mapStateToProps(state) {
    return { currentUser: state.currentUser.user };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'updateUser' })
)(requireAuth(Protected));