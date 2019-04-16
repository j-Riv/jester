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

    render() {
        let games = '';
        if (this.props.lobby !== undefined) {
            if (Array.isArray(this.props.lobby)) {
                games = this.props.lobby.map((game, key) => {
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
                });
            }
        }
        return(
            <div>
                <Container>
                <Search />
                    {games}
                </Container>
            </div>
        )
    }


};

function mapStateToProps(state) {
    return {
        game: state.game.game,
        currentUser: state.currentUser.user,
        lobby: state.lobby.games
    };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(GamesLobby));