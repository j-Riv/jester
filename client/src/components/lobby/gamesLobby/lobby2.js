import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../.././../actions';
import requireAuth from '../../../containers/requireAuth';
import CreateGameModal from '../../../containers/CreateGameModal';

import hostname from '../../../config/config';
const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

class GamesLobby2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreatedGame: false
        }
    }

    componentDidMount = () => {
        // fetch games
        this.props.getAllGames((response) => {
            const games = response.data.games;
            console.log('these should be all the games currently in db:');
            console.log(games);
        });
        // on new game added re fetch
        socket.on('game added', r => {
            this.props.getAllGames((response) => {
                const games = response.data.games;
                console.log('game added ---> ' + r.game);
                console.log('all games after new game added:');
                console.log(games);
            });
        });
    }

    handleNewGame = () => {
        this.props.createGame((response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/room/' + game._id);
        });
    }

    handleClickCreate = () => {
        console.log('show modal');
        this.setState({ showCreateGame: true });
    }

    render() {
        const closeCreateGame = () => this.setState({ showCreateGame: false });

        if (this.props.loading) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                <Container>
                    <CreateGameModal
                        show={this.state.showCreateGame}
                        onHide={closeCreateGame}
                        heading={"Create Game"}
                    />
                    <Row>
                        <Col sm={12}>
                            <Button variant="secondary" className="mt-3" onClick={this.handleClickCreate}>New Game</Button>
                        </Col>
                    </Row>
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
                                            <p>Players: {game.users.length}/{game.max_players}</p>
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
)(requireAuth(GamesLobby2));
