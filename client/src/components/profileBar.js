import React, { Component } from 'react';

class Profile extends Component {
    render() {
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
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <img className="img-fluid img-thumbnail rounded-circle" src="https://i.imgur.com/AQKsp6n.jpg" alt="profile picture" style={imgStyle} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h1 className="text-center " id="username" style={textStyle}>PeePeePooPooMan</h1>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-sm-3 text-center">
                        <h2 style={textStyle}>Ratio: </h2>
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

export default Profile;