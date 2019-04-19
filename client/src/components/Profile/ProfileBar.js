import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import { slide as Menu } from 'react-burger-menu'
import "./Profile.css";
import ProAccord from './ProfileAccord';

// import ProfileModal from './ProfileModal';
class Profile extends React.Component {

    render() {

        const user = this.props.currentUser;
        const total = user.wins + user.losses
        let ratio = user.wins / user.losses
        if (isNaN(ratio)) {
            ratio = "Play some games"
        }


        return (
                
            <Menu>
                <div className="container-fluid pro">
                 <ProAccord />

                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <img className="img-fluid img-thumbnail rounded-circle mt-4" id='proPic' src={user.picture} alt="profile picture" />
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

                </div >

            </Menu>

        );
    }

}

// export default Profile;
function mapStateToProps(state) {
    return { currentUser: state.currentUser.user };
}

export default compose(
    connect(mapStateToProps, actions)
)(requireAuth(Profile));