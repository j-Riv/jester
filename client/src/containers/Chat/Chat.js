import React, { Component } from 'react';
import requireAuth from '../requireAuth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Message from '../../components/Message';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import "./Chat.css";

class Chat extends Component {

    componentDidMount = () => {
        this.props.socket.on('new chat', (msg) => {
            this.props.addMessage(msg, () => {
                console.log('Added message');
            });
        });
    }

    onSubmit = formProps => {
        formProps.user = this.props.username;
        formProps.gameId = this.props.game._id;
        this.props.addMessage(formProps, () => {
            this.props.socket.emit('client msg', formProps);
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
                    className={this.props.username === msg.user ? 'current-user' : ''}
                    />
                )
        }
        return (
            <div id="chatComponent">
                <p className="text-center">Chat <i className="fas fa-comment-alt"></i></p>
                <div id="chatWrapper">
                    <div id="chatArea">
                        <div className="messages" id="messages">
                            {theMessages}
                        </div>
                    </div>
                    <Form id="chatForm" className="mb-1" onSubmit={handleSubmit(this.onSubmit)}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <img id="chatPhoto" src={this.props.picture !== '' ? this.props.picture : '/images/default-user.png' } alt="user" />
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
            </div>
        );
    }
}

function scrollToBottom() {
    const messages = document.getElementById('chatArea');
    messages.scrollTop = messages.offsetHeight;

}

function mapStateToProps(state) {
    return { 
        username: state.currentUser.user.username,
        picture: state.currentUser.user.picture,
        game: state.game.game, 
        messages: state.game.game.messages
    };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'chat' })
)(requireAuth(Chat));