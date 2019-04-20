// import React, { Component } from 'react';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
// import { reduxForm, Field } from 'redux-form';
// import * as actions from '../../actions';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import requireAuth from '../../containers/requireAuth';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';

// class Edit extends Component {

//     componentDidMount = () => {
//         let token = localStorage.getItem('token');
//         if (!token || token === '') {//if there is no token, dont bother
//             return;
//         }
//         // fetch user from token (if server deems it's valid token)
//         this.props.getCurrentUser(token, (response) => {
//             console.log(response);
//         });
//     }

//     onSubmit = formProps => {
//         formProps.id = this.props._id;
//         console.log(formProps);
//         this.props.updateUser(formProps, () => {
//             console.log('submitted');
//         });
//     };

//     render() {
//         const { handleSubmit } = this.props;

//         return (
//             <div>
//                 <Form onSubmit={handleSubmit(this.onSubmit)}>
//                     <Form.Group controlId="picture">
//                         <Form.Label>Photo</Form.Label>
//                         <Field
//                             className="form-control"
//                             name="picture"
//                             type="text"
//                             component="input"
//                             autoComplete="none"
//                             placeholder={this.props.picture}
//                         />
//                     </Form.Group>
//                     <Button variant="light" type="submit" style={{ width: '100%' }}>
//                         Update!
//                                 </Button>
//                 </Form>
//             </div>
//         );
//     }

// }

// function mapStateToProps(state) {
//     return {
//         _id: state.currentUser.user._id,
//         username: state.currentUser.user.username,
//         picture: state.currentUser.user.picture,
//         initialValues: {
//             username: state.currentUser.user.username,
//             picture: state.currentUser.user.pucture
//         }
//     };
// }

// export default compose(
//     connect(mapStateToProps, actions),
//     reduxForm({
//         form: 'updateUser',
//         enableReinitialize: true
//     })
// )(requireAuth(Edit));