import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import EditProfileModal from './EditProfileModal';
import "./profile.css";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showUpdateProfile: false
        }
    }

    handleClickEditProfile = () => {
        console.log('show modal');
        this.setState({ showUpdateProfile: true });
    }

    render() {
        const closeUpdateProfile = () => this.setState({ showUpdateProfile: false });

        const user = this.props.currentUser;
        const total = user.wins + user.losses
        let ratio = user.wins / user.losses
        if (isNaN(ratio)) {
            ratio = "Play some games"
        };


        return (

            <div>
                <EditProfileModal
                    className="editProModal"
                    show={this.state.showUpdateProfile}
                    onHide={closeUpdateProfile}
                />
                <div className="container-fluid pro">

                    {/* <ProfileModal /> */}
                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-4 text-center">
                            <img className="img-fluid img-thumbnail rounded-circle mt-4" id='proPic' src={user.picture} alt={user.username} />
                        </div>
                        <div>
                            <i className="fas fa-cog" onClick={this.handleClickEditProfile}></i>
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