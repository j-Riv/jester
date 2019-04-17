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
                // users have been updated
                console.log(response);
            });
        }
        // get game object from server and save to game state
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            // logging the game object
            console.log(game);
            // get gifs from api and update game state
            this.props.setUserGifs(word, (response) => {
                // got gifs
                // console.log('got gifs with setUserGifs');
                console.log(response);
            });
            // set current turn on first user in game
            if (this.props.game.current_turn === '' || this.props.game.current_turn === null) {
                // setting initial current turn
                // console.log('setting initial current turn');
                this.props.setCurrentTurn(this.props.user, params.gameId);
            }
        });
        // new user connected send update to server
        socket.on('connect', () => {
            const sessionid = socket.id;
            // new user has joined log session/socket id
            // console.log('new user ' + this.props.user + ' joined: connected --> ' + sessionid);
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
            // user has disconnected try to reconnect
            // console.log('user ' + this.props.user + ' has disconnected');
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            // else the socket will automatically try to reconnect
            socket.open();
        });
        // socket reconnected
        socket.on('reconnect', (attemptNumber) => {
            // reconnectiong user display log attempts
            // console.log('reconnecting ' + this.props.user + ' attempts: ' + attemptNumber);
            // update users on socket reconnect
            if (this.props.user !== undefined) {
                this.props.addUser(this.props.user, params.gameId, (response) => {
                    console.log(response);
                });
            }
        });
        // update users
        socket.on('add user', r => {
            // console.log('Update users socket');
            // add new user to state
            // console.log(r);
            store.dispatch({ type: UPDATE_USERS, payload: r });
        });
        // update cards
        socket.on('update cards', r => {
            // console.log('Update cards socket');
            // update cards
            // console.log(r);
            store.dispatch({ type: UPDATE_CARDS, payload: r });
        });
        // update winner ---> might move this out
        socket.on('update winner', r => {
            // console.log('Update winner socket');
            // console.log(r);
            store.dispatch({ type: UPDATE_WINNER, payload: r.user });
            store.dispatch({ type: UPDATE_WINNING_CARD, payload: r.card });
            store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: true });
            // reset game
            setTimeout(() => {
                console.log('Next player is ---> ' + r.nextUser);
                // reset game for next round
                store.dispatch({ type: CLEAR_CARDS, payload: [] });
                store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: false });
                store.dispatch({ type: UPDATE_CURRENT_TURN, payload: r.nextUser });
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
            // console.log('Updating winner: ' + response.user);
            // update winner
            store.dispatch({ type: UPDATE_WINS, payload: r.user });
        });
        // remove user
        socket.on('remove user', r => {
            // console.log('PLEASE REMOVE USER: ' + r.user + '--> and next turn: ' + r.nextUser);
            // remove user and update current turn
            store.dispatch({ type: REMOVE_USER, payload: r.user });
            store.dispatch({ type: UPDATE_CURRENT_TURN, payload: r.nextUser });
        });
    }

    componentWillUnmount = () => {
        const { match: { params } } = this.props;
        // get next user
        const nextUser = getNext(this.props.game.users, this.props.game.current_turn);
        // unmounting ---> remove user from room and pass next user
        // next user: will be used if current turn (king) has left the room
        socket.emit('leave room', { user: this.props.user, gameId: params.gameId, nextUser: nextUser });
        this.props.removeUser(this.props.user, params.gameId, nextUser, (response) => {
            console.log(response);
        });
        // reset card selected when user leaves
        store.dispatch({ type: CARD_SELECTED, payload: false });
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