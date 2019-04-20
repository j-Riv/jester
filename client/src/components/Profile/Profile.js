import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import "./Profile.css";

class Profile extends Component {


    render() {

        const user = this.props.currentUser;
        const total = user.wins + user.losses
        let ratio = user.wins / user.losses
        if (isNaN(ratio)) {
            ratio = "Play some games"
        };


        return (

            <div id="proContainer">

                <div className="container-fluid pro">

                    {/* <ProfileModal /> */}
                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-4 text-center" >
                            <img className="img-fluid img-thumbnail rounded-circle mt-4" id='proPic' src={this.props.currentUser.picture} onClick={this.switch} alt={this.props.currentUser.username} />
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-4 textcenter">
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-12">
                            <h1 className="text-center text" id="username" >{user.username}</h1>
                        </div>
                    </div>
                    {/* math realted stuff */}
                    <div className="row d-flex justify-content-center">
                        <div className="col-3 text-center mr-5 mt-2">
                            <h2 className="text">Ratio: {ratio}</h2>
                        </div>
                        <div className="col-3  text-center">
                            <h2 className="text" id="gamesPlayed">Games Played: {total} </h2>
                        </div>
                    </div>
                </div>

            </div>

        );
    }

}

function mapStateToProps(state) {
    return { currentUser: state.currentUser.user };
}

export default compose(
    connect(mapStateToProps, actions)
)(requireAuth(Profile));