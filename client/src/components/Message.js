import React, { Component } from 'react';
// import "./Message.css";

class Message extends Component {
    render() {
        return (
            <p>
                <span className={this.props.className}>{this.props.user}</span> - {this.props.msg}
            </p>
        );
    }
}

export default Message;