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

    constructor(props) {
        super(props);
        this.state = {
            showUpdateProfile: false
        }
    }

    onSubmit = formProps => {
        formProps.id = this.props._id;
        console.log(formProps);
        this.props.updateUser(formProps, () => {
            console.log('submitted');
        });
    };

    render() {
        const closeUpdateProfile = () => this.setState({ showUpdateProfile: false });
        const { handleSubmit } = this.props;
        const user = this.props.currentUser;
       

        if (user.picture === '') {
            return <div>Loading...</div>;
        }

        return (

            <div>
                <div className="container-fluid pro">

                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-4 text-center">
                            <img className="img-fluid img-thumbnail rounded-circle mt-4" id='proPic' src={user.picture} alt={user.username} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-12">
                            <h1 className="text-center text" id="username" >{user.username}</h1>
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