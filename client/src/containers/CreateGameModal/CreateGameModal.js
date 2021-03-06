import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './creategamemodal.css';

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
            'Select',
            'Safe For Work',
            'Not Safe For Work'
        ];

        // const status = [
        //     'Select',
        //     'public',
        //     'private'
        // ];

        const DropDownSelect = (x) => {
            let value = x;
            if (x === 'Select') {
                value = '';
            }
            return (
                <option key={x} value={value}>{x}</option>
            );
        }

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                id="createGameModal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        CREATE GAME
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

                        {/* <Form.Group controlId="game_status">
                            <Form.Label>Game Status</Form.Label>
                            <Field
                                className="form-control"
                                name="game_status"
                                component="select"
                            >
                                {status.map(DropDownSelect)}
                            </Field>
                        </Form.Group> */}

                        <Button variant="highlight" type="submit" style={{ width: '100%' }}>
                            Create Game!    
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="highlight" onClick={this.props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return { 
        currentUser: state.currentUser.user,
        auth: state.auth.authorization
    };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'createGame' })
)(withRouter(CreateGameModal));