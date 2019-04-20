import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import "./Profile.css";
// import ProfileAccord from "./ProfileAccord"

class Profile extends Component {

    render() {

        const user = this.props.currentUser;
        const total = user.wins + user.losses
        let ratio = user.wins / user.losses
        if (isNaN(ratio)) {
            ratio = "Play some games"
        }

        return (

            <div>

                <div className="container-fluid pro">

                    {/* <ProfileModal /> */}
                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-3 text-center">
                            <img className="img-fluid img-thumbnail rounded-circle mt-4" id='proPic' src={user.picture} onClick={this.hello} alt={user.username} />
                        </div>
                    </div>
                    <div className="row">
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
                    {/* recent games */}
                    <div className="row">
                        <div className="col-sm-12">
                            <h2 className="text-center text">Recent Games:</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 d-flex justify-content-center">
                            <div className="row border ">
                                <div className="col-4">
                                    <img className="img-fluid img-thumbnail rounded-circle w-100" id="gamePic" src="https://i.imgur.com/AQKsp6n.jpg" alt="user" />
                                </div>
                                <div className="col-4 align-self-center text">
                                    <p>User1</p>
                                </div>
                                <div className="col-4 align-self-center text">
                                    <p>Win</p>
                                </div>
                            </div>

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