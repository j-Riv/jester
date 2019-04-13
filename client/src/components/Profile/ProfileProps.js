import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';

class Prodata extends React.Component {
    render() {
        const user = this.props.currentUser;
        const textStyle = {
            width: '100%',
            fontSize: '100%'
        }
        return (
            <div>
                <div className="row d-flex justify-content-center">
                    <div className="col-sm-3 text-center">
                        <h2 style={textStyle}>Wins: {user.wins}</h2>
                    </div>
                    <div className="col-sm-3  text-center">
                        <h2 style={textStyle}>Games Played: </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h2 className="text-center" style={textStyle}>Recent Games:</h2>
                    </div>
                </div>
            </div>
        )
    }
}
// export default Profile;
function mapStateToProps(state) {
    return { currentUser: state.currentUser.user };
}

export default compose(
    connect(mapStateToProps, actions)
)(requireAuth(Prodata));
