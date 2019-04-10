import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import server from '../config/config';
// import "./Chat.css";

class Chat extends Component {
    componentDidMount = () => {
        // const socket = socketIOClient(server, { secure: true });
        // // socket.on('new message', data => this.setState({ savedBook: data, showDeleted: true }));
        // socket.on('new message', data => store.dispatch());
    }

    onSubmit = formProps => {
        this.props.addMessage(formProps, () => {
            console.log(formProps);
            console.log('submitted');
        });
    };

    render() {
        console.log(this.props.chat);
        const { handleSubmit } = this.props;
        // socket
        let connected = false;
        let typing = false;
        var lastTypingTime;
        const socket = socketIOClient();
        socket.emit('add user', 'username');
        // end socket

        return (
            <div id="chatWrapper">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <Button variant="secondary">Chat <i className="fas fa-comment-alt"></i></Button>
                </div>
                <div id="chat" className="tab-content">
                    <div className="chatArea">
                        <ul className="messages">
                            {this.props.chat.map((msg, index) =>
                                <Message
                                    key={index}
                                    msg={msg.Message}
                                />
                            )}
                        </ul>
                    </div>
                    {/* <div id="chatForm" className="input-group mb-1">
                        <div className="input-group-prepend">
                            <img id="chatPhoto" src="./images/default-user.png" alt="user" />
                        </div>
                        <input type="text" className="form-control inputMessage" placeholder="Type here..." aria-describedby="sendMessage" />
                        <div className="input-group-append">
                            <Button variant="secondary" id="sendMessage">Send</Button>
                        </div>
                    </div> */}

                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <fieldset>
                            <label>Message</label>
                            <Field
                                name="Message"
                                type="text"
                                component="input"
                                autoComplete="none"
                            />
                        </fieldset>
                        <button>Send!</button>
                    </form>

                </div>
            </div>
        );
    }
}

function setMessage(msg) {
    return {
        type: "ADD_CHAT",
        payload: msg
    }
}

function mapStateToProps(state) {
    return { chat: state.chat.chat };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'chat' })
)(Chat);