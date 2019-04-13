import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import Prodata from './ProfileProps';
import { reduxForm, Field } from 'redux-form';
// react-bootstrap
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Protected from '../Protected';
class ProfileModal extends Component {
    onSubmit = formProps => {
        formProps.id = this.props.currentUser._id;
        console.log(formProps);
        this.props.updateUser(formProps, () => {
            console.log('submitted');
        });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Row>
                            <Col className='text-center'>
                                <Modal.Title>Settings</Modal.Title>
                            </Col>
                        </Row>
                    </Modal.Header>

                    <Modal.Body>
                        <Row>
                            <Col>
                                <form onSubmit={handleSubmit(this.onSubmit)}>
                                    <fieldset>
                                        <Row>
                                            <Col>
                                                <label>Username</label>
                                            </Col>
                                            <Field
                                                name="username"
                                                type="text"
                                                component="input"
                                                autoComplete="none"
                                                placeholder={this.props.currentUser.username}
                                            />
                                        </Row>
                                        <Row>
                                            <Col>
                                                <label>Profile Picture</label>
                                            </Col>
                                            <Field
                                                name="picture"
                                                type="text"
                                                component="input"
                                                autoComplete="none"
                                                placeholder={this.props.currentUser.picture}
                                            />
                                        </Row>
                                    </fieldset>
                                    <button>Update!</button>
                                </form>

                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary">Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>;
        </div >
        );
    }
}
// export default Profile;
function mapStateToProps(state) {
    return { currentUser: state.currentUser.user };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'updateUser' })
)(requireAuth(ProfileModal));