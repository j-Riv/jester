import React, { Component } from 'react';
const axios = require('axios');
class Profile extends Component {

    state = {
        username: '',
        picture: '',
        wins: '',
        losses: ''
    }

    componentDidMount() {
        const id = '5cae8704bf624e38d45018b9'
        axios.get('/find/' + id)
            .then(res => {
                const username = res.data.username;
                const picture = res.data.picture;
                const wins = res.data.wins;
                const losses = res.data.losses;
                this.setState({
                    username: username,
                    picture: picture,
                    wins: wins,
                    losses: losses
                })
            }).catch(err =>{
                if (err) throw (err);
            });
          
    }

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
                        <img className="img-fluid img-thumbnail rounded-circle" src={this.state.picture} alt="profile picture" style={imgStyle} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h1 className="text-center " id="username" style={textStyle}>{this.state.username}</h1>
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