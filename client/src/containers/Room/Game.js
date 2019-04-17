import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../requireAuth';
import Sidebar from '../Sidebar/Sidebar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Chat from '../Chat/Chat';
import words from '../../words/words-clean';
import io from 'socket.io-client';
import hostname from '../../config/config';
import store from '../../store';
import { 
    UPDATE_USERS,
    REMOVE_USER, 
    UPDATE_CARDS, 
    UPDATE_WINNER,
    UPDATE_WINNING_CARD,
    UPDATE_WINNER_CHOSEN,
    CARD_SELECTED,
    UPDATE_CURRENT_TURN,
    CLEAR_CARDS,
    UPDATE_WINS
} from '../../actions/types';
import './Room.css';
import KingView from '../KingView/KingView';
import JesterView from '../JesterView/JesterView';

const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

class Game extends Component {

    componentDidMount = () => {
        console.log('Host: ' + hostname);
        // declare words for api call later
        const word = [
            words.words[~~(Math.random() * words.words.length)],
            words.words[~~(Math.random() * words.words.length)],
            words.words[~~(Math.random() * words.words.length)]
        ];
        // crete game room
        const { match: { params } } = this.props;
        socket.emit('create', params.gameId);
        console.log('creating game: ' + params.gameId);
        // add user to game room
        if (this.props.user !== undefined) {
            this.props.addUser(this.props.user, params.gameId, (response) => {
                console.log('users have been updated');
                console.log(response);
            });
        }
        // get game object from server and save to game state
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log('this is the game');
            console.log(game);
            // get gifs from api and update game state
            this.props.setUserGifs(word, (response) => {
                console.log('got gifs with setUserGifs');
                console.log(response);
            });
            // set current turn on first user in game
            if (this.props.game.current_turn === '' || this.props.game.current_turn === null) {
                console.log('setting initial current turn');
                this.props.setCurrentTurn(this.props.user, params.gameId);
            }
        });
        // new user connected send update to server
        socket.on('connect', () => {
            const sessionid = socket.id;
            console.log('new user ' + this.props.user + ' joined: connected --> ' + sessionid);
            // update users on new user connect
            if (this.props.user !== undefined) {
                this.props.addUser(this.props.user, params.gameId, (response) => {
                    console.log('users have been updated');
                    console.log(response);
                });
            }
            // emit event so other clients know to update users in game state
            socket.emit('user connected', { user: this.props.user });
        });
        // user disconnected send update to server
        socket.on('disconnect', (reason) => {
            console.log('user ' + this.props.user + ' has disconnected');
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            // else the socket will automatically try to reconnect
            socket.open();
        });
        // socket reconnected
        socket.on('reconnect', (attemptNumber) => {
            console.log('reconnecting ' + this.props.user + ' attempts: ' + attemptNumber);
            // update users on socket reconnect
            if (this.props.user !== undefined) {
                this.props.addUser(this.props.user, params.gameId, (response) => {
                    console.log(response);
                });
            }
        });
        // update users
        socket.on('add user', response => {
            console.log('Update users socket');
            console.log(response);
            store.dispatch({ type: UPDATE_USERS, payload: response });
        });
        // update cards
        socket.on('Update Cards', response => {
            console.log('Update cards socket');
            console.log(response);
            store.dispatch({ type: UPDATE_CARDS, payload: response });
        });
        // update winner ---> might move this out
        socket.on('Update Winner', response => {
            console.log('Update winner socket');
            console.log(response);
            store.dispatch({ type: UPDATE_WINNER, payload: response.user });
            store.dispatch({ type: UPDATE_WINNING_CARD, payload: response.card });
            store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: true });
            // reset game
            setTimeout(() => {
                console.log('Next player is ---> ' + response.next);
                // reset game for next round
                store.dispatch({ type: CLEAR_CARDS, payload: [] });
                store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: false });
                store.dispatch({ type: UPDATE_CURRENT_TURN, payload: response.next });
                store.dispatch({ type: CARD_SELECTED, payload: false });
                // get new gifs
                const newWord = [
                    words.words[~~(Math.random() * words.words.length)],
                    words.words[~~(Math.random() * words.words.length)],
                    words.words[~~(Math.random() * words.words.length)]
                ];
                this.props.setUserGifs(newWord, (response) => {
                    console.log('got new gifs');
                    console.log(response);
                });
            }, 3000);
            // update wins
            console.log('Updating winner: ' + response.user);
            store.dispatch({ type: UPDATE_WINS, payload: response.user });
        });
        // remove user
        socket.on('remove user', r => {
            console.log('PLEASE REMOVE USER: ' + r.user + '-------------------->');
            // dispatch action
            store.dispatch({ type: REMOVE_USER, payload: r.user });
        });
    }

    componentWillUnmount = () => {
        const { match: { params } } = this.props;
        const nextUser = getNext(this.props.game.users, this.props.game.current_turn);
        socket.emit('leave room', { user: this.props.user, gameId: params.gameId, next: nextUser });
        this.props.removeUser(this.props.user, params.gameId, (response) => {
            console.log('user has been removed');
            console.log(response);
        });
    }

    render() {
        const { match: { params } } = this.props;
        // user list
        let users = '';
        if (this.props.game.users && this.props.game.users !== undefined && this.props.game.users !== null) {
            if (Array.isArray(this.props.game.users)) {
                users = this.props.game.users.map((player, key) => {
                    return (
                        <li key={key}>
                            <i className={`fas fa-user ${this.props.user === player.user ? 'text-red' : 'text-black'}`}></i> {player.user} <i className="fas fa-long-arrow-alt-right"></i> {player.wins}
                        </li>
                    );
                });
            }
        }
        // display views
        let view;
        if (this.props.game.current_turn === this.props.user) {
            view = <KingView users={users} getNext={getNext}/>
        }else{
            view = <JesterView users={users} />
        }
        return (
            <div id="roomOuter">
                <Sidebar gameId={params.gameId} socket={socket} />
                <Container fluid={true} id="room">
                    <Row>
                        <Col sm={12} className="text-center">
                            <h3 className="text-uppercase"><i className="fab fa-fort-awesome"></i> {this.props.game.game_name}</h3>
                            {view}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

function getNext(all, user) {
    console.log('Next -------->');
    console.log('all users;');
    console.log(all);
    console.log('user:');
    console.log(user);
    const index = all.findIndex(u => u.user === user);
    let nextUser;
    if (index >= 0 && index < all.length - 1) {
        nextUser = all[index + 1].user;
        console.log('not last');
    } else {
        nextUser = all[0].user;
        console.log('last');
    }
    console.log('next user: ' + nextUser);
    console.log('End of Next -------->')
    return nextUser;
}

function mapStateToProps(state) {
    return { 
        game: state.game.game,
        user: state.currentUser.user.username
     };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(Game));