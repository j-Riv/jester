import React, { Component } from 'react';
import requireAuth from './requireAuth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Message from '../components/Message';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import "./styles/Chat.css";
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
    transports: ['websocket']
});

class Chat extends Component {
    theMessages = () => {
        this.props.game.message.map((msg, index) =>
            <Message
                key={index}
                user={msg.user}
                msg={msg.message}
            />
        )
    }

    componentDidMount = () => {
        // get game object
        const { match: { params } } = this.props;
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log(game);
        });
        
        socket.on('connect', () => {
            console.log("socket connected");
        });

        socket.on('msg-' + params.gameId, (r) => {
            this.props.addMessage(r, () => {
                console.log('Added message');
            });
        });

        socket.on('connect_error', (err) => {
            console.log(err)
        });

        socket.on('disconnect', () => {
            console.log("Disconnected Socket!")
        });
    }

    onSubmit = formProps => {
        formProps.user = this.props.currentUser.username;
        formProps.gameId = this.props.game._id;
        this.props.addMessage(formProps, () => {
            socket.emit('client msg', formProps);
        });
    };

    render() {
        console.log(this.props.chat);
        const { handleSubmit } = this.props;
        let theMessages = '';
        if(Array.isArray(this.props.messages)) {
            theMessages = this.props.messages.map((msg, index) =>
                    <Message
                        key={index}
                    user={msg.user}
                    msg={msg.message}
                    />
                )
        }
        return (
            <div id="chatWrapper">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <Button variant="secondary">Chat <i className="fas fa-comment-alt"></i></Button>
                </div>
                <div id="chat" className="tab-content">
                    <div className="chatArea">
                        <ul className="messages">
                            {theMessages}
                        </ul>
                    </div>
                    <Form id="chatForm" className="mb-1" onSubmit={handleSubmit(this.onSubmit)}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <img id="chatPhoto" src="./images/default-user.png" alt="user" />
                            </InputGroup.Prepend>
                            <Field
                                className="form-control"
                                placeholder="Type here..."
                                name="message"
                                type="text"
                                component="input"
                                autoComplete="none"
                            />
                            <InputGroup.Append>
                                <Button variant="secondary" id="sendMessage" type="submit">Send!</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </div>
                <h1>ID: {this.props.game._id}</h1>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser.user, chat: state.chat, game: state.game.game, messages: state.game.game.messages};
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'chat' })
)(requireAuth(Chat));