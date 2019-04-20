import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import requireAuth from '../../containers/requireAuth';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class EditProfile extends Component {

    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (!token || token === '') {//if there is no token, dont bother
            return;
        }
        // fetch user from token (if server deems it's valid token)
        this.props.getCurrentUser(token, (response) => {
            console.log(response);
        });
    }

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
            <div>
                <Container>
                    <Row>
                        <Col sm={12} className="text-center pb-3">
                            Edit your username and photo below.
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={6} lg={6} className="text-center">
                            <img src={this.props.picture} alt={this.props.username} style={{ maxWidth: '300px' }} />
                        </Col>
                        <Col sm={12} md={6} lg={6} className="text-center">
                            <Form onSubmit={handleSubmit(this.onSubmit)}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Field
                                        className="form-control"
                                        name="username"
                                        type="text"
                                        component="input"
                                        autoComplete="none"
                                        placeholder={this.props.username}
                                    />
                                </Form.Group>

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
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        _id: state.currentUser.user._id,
        username: state.currentUser.user.username,
        picture: state.currentUser.user.picture,
        initialValues: {
            username: state.currentUser.user.username,
            picture: state.currentUser.user.pucture
        }
    };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ 
        form: 'updateUser',
        enableReinitialize: true
    })
)(requireAuth(EditProfile));