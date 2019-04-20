import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ChildComponent => {
    class ComposedComponent extends Component {

        // Our component just got rendered
        componentDidMount() {
            this.navigateToLobby();
        }

        // Our component just got updated
        componentDidUpdate() {
            this.navigateToLobby();
        }

        navigateToLobby() {
            if (this.props.auth) {
                this.props.history.push('/lobby');
            }
        }

        render() {
            return <ChildComponent {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return { auth: state.auth.authenticated };
    }

    return connect(mapStateToProps)(ComposedComponent);
};