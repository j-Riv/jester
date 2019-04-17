import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../../containers/requireAuth';
import Prodata from './ProfileProps';
import ProfileModal from './ProfileModal';
class Profile extends Component {

    render() {

        const user = this.props.currentUser;
        const textStyle = {
            width: '100%',
            fontSize: '100%'
        }
        const imgStyle = {
            width: '133px',
            height: '133px'
        }
        return (
            <div className="container-fluid">
                <ProfileModal />
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <img className="img-fluid img-thumbnail rounded-circle" src={user.picture} alt="profile picture" style={imgStyle} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h1 className="text-center " id="username" style={textStyle}>{this.props.currentUser.username}</h1>
                    </div>
                </div>
                {/* math realted stuff */}
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

                {/* recent games */}
                <div className="row">
                    <div className="col-sm-12 d-flex justify-content-center">
                        <div className="row border w-50">
                            <div className="col-sm-4">
                                <img className="img-fluid img-thumbnail rounded-circle" src="https://i.imgur.com/AQKsp6n.jpg" alt="user" style={imgStyle} />
                            </div>
                            <div className="col-sm-4 align-self-center">
                                <p>User1</p>
                            </div>
                            <div className="col-sm-4 align-self-center">
                                <p>Win/Loss</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div >

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