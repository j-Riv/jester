import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import "./profile.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Profile extends Component {

    picStyles = {
        height: '200px',
        width: '200px',
        backgroundColor: 'white'
    }

    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (!token || token === '') {//if there is no token, dont bother
            return;
        }
        // fetch user from token (if server deems it's valid token)
        this.props.getCurrentUser(token);
    }

    onSubmit = formProps => {
        formProps.id = this.props._id;
        this.props.updateUser(formProps);
    };

    render() {
        const { handleSubmit } = this.props;

        if (this.props.picture === '') {
            return <div>Loading...</div>;
        }

        return (

            <div>
                <div className="container-fluid pro">

                    <div className="d-flex justify-content-center">
                        <div className="rounded-circle" style={this.picStyles}>
                            <img className="w-100 rounded-circle" src={this.props.picture} alt={this.props.username} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-12">
                            <h1 className="text-center text" id="username" >{this.props.username}</h1>
                        </div>
                    </div>
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

                        <Button variant="highlight" type="submit" style={{ width: '100%' }}>
                            Update!
                        </Button>
                    </Form>
                </div>

            </div>

        );
    }

}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser.user,
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
)(requireAuth(Profile));