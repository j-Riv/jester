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
        // // get game object
        // const { match: { params } } = this.props;
        // this.props.getGame(params.gameId, (response) => {
        //     const game = response.data.game;
        //     console.log(game);
        // });
        console.log('Chat game id: ' + this.props.gameId);
        
        socket.on('connect', () => {
            console.log("socket connected");
        });

        socket.on('msg-' + this.props.gameId, (r) => {
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
            scrollToBottom();
        });
    };

    render() {
        const { handleSubmit } = this.props;
        let theMessages = '';
        if(Array.isArray(this.props.messages)) {
            theMessages = this.props.messages.map((msg, index) =>
                    <Message
                        key={index}
                    user={msg.user}
                    msg={msg.message}
                    className={this.props.currentUser.username === msg.user ? 'current-user' : ''}
                    />
                )
        }
        return (
            <div id="chatComponent">
                {/* <div id="chatArea">
                    <ul className="messages">
                        {theMessages}
                    </ul>
                </div>
                <Form id="chatForm" className="mb-1" onSubmit={handleSubmit(this.onSubmit)}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <img id="chatPhoto" src="/images/default-user.png" alt="user" />
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
                </Form> */}
                <div id="chatArea">
                    <ul className="messages" id="messages">
                        {theMessages}
                    </ul>
                </div>
                <Form id="chatForm" className="mb-1" onSubmit={handleSubmit(this.onSubmit)}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <img id="chatPhoto" src="/images/default-user.png" alt="user" />
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

        );
    }
}

function scrollToBottom() {
    const messages = document.getElementById('chatArea');
    messages.scrollTop = messages.scrollHeight;
    console.log('sh: ' + messages.scrollTop);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser.user, game: state.game.game, messages: state.game.game.messages};
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'chat' })
)(requireAuth(Chat));