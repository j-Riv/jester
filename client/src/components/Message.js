import React, { Component } from 'react';
// import "./Message.css";

class Message extends Component {
    render() {
        return (
            <li>
                <span className={this.props.className}>{this.props.user}</span> - {this.props.msg}
            </li>
        );
    }
}

export default Message;