import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import requireAuth from '../requireAuth';
import Sidebar from '../Sidebar/Sidebar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Chat from '../Chat/Chat';
import Profile from '../../components/Profile/Profile';
import words from '../../words/words-clean';
import io from 'socket.io-client';
import hostname from '../../config/config';
import store from '../../store';
import { 
    UPDATE_USERS,
    REMOVE_USER, 
    UPDATE_CARDS, 
    UPDATE_WINNER,
    CARD_SELECTED,
    UPDATE_CURRENT_TURN
} from '../../actions/types';
import './Room.css';
import KingView from '../KingView/KingView';
import JesterView from '../JesterView/JesterView';

import { push as Menu } from 'react-burger-menu';

const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

class Game extends Component {
    // local component state used for menus
    constructor(props) {
        super(props)
        this.state = {
            chatOpen: false,
            profileOpen: false
        }
    }
    // This keeps your state in sync with the opening/closing of the menu
    handleStateChange(state, menu) {
        this.setState({ [menu]: state.isOpen });
    }
    // This can be used to close the menu, e.g. when a user clicks a menu item
    closeMenu(menu) {
        this.setState({ [menu]: false });
    }
    // This can be used to toggle the menu, e.g. when using a custom icon
    toggleMenu(menu) {
        this.setState({ [menu]: !this.state.menuOpen });
    }

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
        // update winner
        socket.on('update winner', r => {
            // update winner --> wins
            // update winning card
            // update winner chosen
            // reset game
            this.props.afterWin(r);
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
                {/* <Sidebar gameId={params.gameId} socket={socket} /> */}
                <Menu
                    Right
                    isOpen={this.state.chatOpen}
                    onStateChange={(state) => this.handleStateChange(state, "chatOpen")}
                    customBurgerIcon={false}
                    customCrossIcon={false}
                    pageWrapId={'room'} 
                    outerContainerId={'roomOuter'}
                    width={'50%'}
                >
                    <Chat gameId={params.gameId} socket={socket} />
                </Menu>

                <Menu
                    right
                    isOpen={this.state.profileOpen}
                    onStateChange={(state) => this.handleStateChange(state, "profileOpen")}
                    customBurgerIcon={false}
                    customCrossIcon={false}
                    pageWrapId={'room'}
                    outerContainerId={'roomOuter'}
                    width={'50%'}
                >
                    <Profile />
                </Menu>


                <Container fluid={true} id="room">
                    <Row>
                        <Col sm={12} className="text-center">
                            <h3 className="text-uppercase"><i className="fab fa-fort-awesome"></i> {this.props.game.game_name}</h3>
                            {view}
                        </Col>
                    </Row>
                </Container>
                <div id="buttonContainer" className="text-center">
                    <Button variant="light" className="m-2" onClick={() => this.toggleMenu('chatOpen')}><i class="fas fa-comment-alt"></i> Chat</Button>
                    <Button variant="light" className="m-2" onClick={() => this.toggleMenu('profileOpen')}><i class="fas fa-user-circle"></i> Profile</Button>
                </div>
            </div>
        );
    }
}

function getNext(all, user) {
    const index = all.findIndex(u => u.user === user);
    let nextUser;
    if (index >= 0 && index < all.length - 1) {
        nextUser = all[index + 1].user;
    } else {
        nextUser = all[0].user;
    }
    return nextUser;
}

function mapStateToProps(state) {
    return { 
        game: state.game.game,
        user: state.currentUser.user.username,
        currentUser: state.currentUser.user
     };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(Game));