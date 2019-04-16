import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Search from '../searchLobby/searchLobby';
import peeps from '../peeps.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../.././../actions';
import requireAuth from '../../../containers/requireAuth';


class GamesLobby extends Component {
    
    componentDidMount = () => {
        // fetch games
        this.props.getAllGames((response) => {
            const games = response.data.games;
            console.log('these should be all the games currently in db:');
            console.log(games);
        });
    }

    render() {
        if (this.props.loading) {
            return <div>Loading...</div>;
        }
        return(
            <div>
                <Container>
                <Search />
                    {this.props.lobby.map((game, key) => {
                    return (
                        <Row key={game._id}>
                        <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <h5>Creator: {game.username}</h5>
                                <Image src={game.image} roundedCircle />
                            </div>

                        </Col>

                        <Col md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <Link to={`/room/${game._id}`}>
                                    <h3>Name: {game.game_name}</h3>
                                    <p>Players: 0/{game.max_players}</p>
                                </Link>
                            </div>

                        </Col>

                        <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <p>Category: {game.category}</p>
                                <p>Status: {game.status}</p>
                            </div>
                        </Col>
                    </Row>
                    );
                })}
                </Container>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        game: state.game.game,
        currentUser: state.currentUser.user,
        lobby: state.lobby.games.all,
        loading: state.lobby.games.loading
    };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(GamesLobby));