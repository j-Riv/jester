import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../actions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class CreateGameModal extends React.Component {
    handleNewGame = formProps => {
        formProps.current_turn = this.props.currentUser.username;
        formProps.user_pic = this.props.currentUser.users;
        formProps.username = this.props.currentUser.username;
        this.props.createGame(formProps, (response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/room/' + game._id);
        });
    }

    render() {
        const { handleSubmit } = this.props;

        const categories = [
            'Safe For Work',
            'Not Safe For Work'
        ];

        const status = [
            'public',
            'private'
        ];

        const DropDownSelect = (x) => {
            return (
                <option key={x} value={x}>{x}</option>
            );
        }

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.heading}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="createGame" className="mb-1" onSubmit={handleSubmit(this.handleNewGame)}>
                        <Form.Group controlId="game_name">
                            <Form.Label>Game Name</Form.Label>
                            <Field
                                className="form-control"
                                name="game_name"
                                type="text"
                                component="input"
                                autoComplete="none"
                            />
                        </Form.Group>

                        <Form.Group controlId="game_category">
                            <Form.Label>Game Category</Form.Label>
                            <Field
                                className="form-control"
                                name="game_category"
                                component="select"
                            >
                            {categories.map(DropDownSelect)}
                            </Field>
                        </Form.Group>

                        <Form.Group controlId="game_status">
                            <Form.Label>Game Status</Form.Label>
                            <Field
                                className="form-control"
                                name="game_status"
                                component="select"
                            >
                                {status.map(DropDownSelect)}
                            </Field>
                        </Form.Group>

                        <Button variant="secondary" type="submit" style={{ width: '100%' }}>
                            Create Game!    
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser.user };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'createGame' })
)(withRouter(CreateGameModal));