import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class EditProfileModal extends React.Component {
    onSubmit = formProps => {
        formProps.id = this.props._id;
        console.log(formProps);
        this.props.updateUser(formProps, () => {
            console.log('submitted');
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
                className="update-profile-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        UPDATE PROFILE
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(this.onSubmit)}>
                        <Form.Group controlId="picture">
                            <Form.Label>Photo</Form.Label>
                            <Field
                                className="form-control"
                                name="picture"
                                type="text"
                                component="input"
                                autoComplete="none"
                                placeholder={this.props.picture}
                            />
                        </Form.Group>

                        <Button variant="light" type="submit" style={{ width: '100%' }}>
                            Update!
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        _id: state.currentUser.user._id,
        username: state.currentUser.user.username,
        picture: state.currentUser.user.picture,
        initialValues: {
            picture: state.currentUser.user.pucture
        }
    };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'updateUser' })
)(withRouter(EditProfileModal));