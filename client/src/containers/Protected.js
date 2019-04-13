import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import requireAuth from './requireAuth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import VerticallyCenteredModal from './VerticallyCenteredModal';

class Protected extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreatedGame: false
        }
    }

    onSubmit = formProps => {
        formProps.id = this.props.currentUser._id;
        console.log(formProps);
        this.props.updateUser(formProps, () => {
            console.log('submitted');
        });const { handleSubmit } = this.props;
    };

    handleNewGame = () => {
        this.props.createGame((response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/room/' + game._id);
        });
    }

    handleClickCreate = () => {
        console.log('show modal');
        this.setState({ showCreateGame: true });
    }

    render() {
        const { handleSubmit } = this.props;
        
        const closeCreateGame = () => this.setState({ showCreateGame: false });
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
                        <Button variant="secondary" className="mt-3" onClick={this.handleClickCreate}>New Chat</Button>
                    </Col>
                </Row>
                <VerticallyCenteredModal
                    show={this.state.showCreateGame}
                    onHide={closeCreateGame}
                    heading={"Create Game"}
                />
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