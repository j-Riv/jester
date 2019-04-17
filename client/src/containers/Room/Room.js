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
import Host from '../../config/config';
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

const socket = io(Host, {
    transports: ['websocket'],
    secure: true
});

class Game extends Component {

    componentDidMount = () => {
        console.log('Host: ' + Host);
        // crete game
        const { match: { params } } = this.props;
        socket.emit('create', params.gameId);
        console.log('creating game: ' + params.gameId);
        // update users
        if (this.props.currentUser.username !== undefined) {
            this.props.addUser(this.props.currentUser.username, params.gameId, (response) => {
                console.log('users have been updated');
                console.log(response);
            });
        }
        // get game object
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log('this is the game');
            console.log(game);
            this.props.setUserGifs(word, (response) => {
                console.log('got gifs with setUserGifs');
                console.log(response);
            });
            if (this.props.game.current_turn === '' || this.props.game.current_turn === null) {
                console.log('SET CURRENT TURN');
                this.props.setCurrentTurn(this.props.currentUser.username, params.gameId);
            }
        });
        // get gifs
        const word = [
            words.words[~~(Math.random() * words.words.length)],
            words.words[~~(Math.random() * words.words.length)],
            words.words[~~(Math.random() * words.words.length)]
        ];
        console.log(`word ${word}`);
        // this.props.getGifs(word, (response) => {
        //     const gifs = response.data.game;
        //     console.log('got gifs');
        //     console.log(gifs);
        // });

        // new user connected send update to server
        socket.on('connect', () => {
            const sessionid = socket.id;
            console.log('new user ' + this.props.currentUser.username + ' joined: connected --> ' + sessionid);
            // update users on new user connect
            if (this.props.currentUser.username !== undefined) {
                this.props.addUser(this.props.currentUser.username, params.gameId, (response) => {
                    console.log('users have been updated');
                    console.log(response);
                });
            }
            socket.emit('user connected', { user: this.props.currentUser.username });
        });
        // new user disconnected send update to server
        socket.on('disconnect', (reason) => {
            console.log('user ' + this.props.currentUser.username + ' has disconnected');
            socket.emit('disconnected', this.props.currentUser.username);
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            // else the socket will automatically try to reconnect
            socket.open();
        });
        socket.on('reconnect', (attemptNumber) => {
            console.log('reconnecting ' + this.props.currentUser.username + ' attempts: ' + attemptNumber);
            // update users on new user connect
            if (this.props.currentUser.username !== undefined) {
                this.props.addUser(this.props.currentUser.username, params.gameId, (response) => {
                    console.log('users have been updated');
                    console.log(response);
                });
            }
        });
        // update users
        socket.on('Update Users', response => {
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
        // update winner
        socket.on('Update Winner', response => {
            console.log('Update winner socket');
            console.log(response);
            store.dispatch({ type: UPDATE_WINNER, payload: response.user });
            store.dispatch({ type: UPDATE_WINNING_CARD, payload: response.card });
            store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: true });
            // reset game
            setTimeout(() => {
                // const next = getNext(this.props.game.users, this.props.game.current_turn);
                console.log('Next player is ---> ' + response.next);
                // reset game for next round
                // store.dispatch({ type: UPDATE_WINNER, payload: '' });
                // store.dispatch({ type: UPDATE_WINNING_CARD, payload: '' });
                store.dispatch({ type: CLEAR_CARDS, payload: [] })
                store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: false });
                store.dispatch({ type: UPDATE_CURRENT_TURN, payload: response.next });
                store.dispatch({ type: CARD_SELECTED, payload: false });
                // get new gifs
                const newWord = words.words[~~(Math.random() * words.words.length)];
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
        socket.emit('leave room', { user: this.props.currentUser.username, gameId: params.gameId });
        this.props.removeUser(this.props.currentUser.username, params.gameId, (response) => {
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
                            <i className={`fas fa-user ${this.props.currentUser.username === player.user ? 'text-red' : 'text-black'}`}></i> {player.user} <i className="fas fa-long-arrow-alt-right"></i> {player.wins}
                        </li>
                    );
                });
            }
        }
        // display views
        let view;
        if (this.props.game.current_turn === this.props.currentUser.username) {
            view = <KingView users={users} />
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

function mapStateToProps(state) {
    return { 
        game: state.game.game,
        currentUser: state.currentUser.user
     };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(Game));