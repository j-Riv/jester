import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import requireAuth from './requireAuth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Chat from './Chat';
import words from '../words/words-clean';
import io from 'socket.io-client';
import store from '../store';
import { 
    UPDATE_USERS, 
    UPDATE_CARDS, 
    UPDATE_WINNER,
    UPDATE_WINNING_CARD,
    UPDATE_WINNER_CHOSEN,
    CARD_SELECTED,
    UPDATE_CURRENT_TURN,
    CLEAR_CARDS,
    UPDATE_WINS
} from '../actions/types';
import KingView from './KingView/KingView';
import JesterView from './JesterView/JesterView';

const socket = io('http://localhost:3001', {
    transports: ['websocket']
});

class Game extends Component {

    componentWillMount = () => {
        // get game object
        const { match: { params } } = this.props;
        socket.emit('create', params.gameId);
        console.log('creating game: ' + params.gameId);
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log('this is the game');
            console.log(game);
        });
    }

    componentDidMount = () => {
        const { match: { params } } = this.props;
        // get gifs
        const word = words.words[~~(Math.random() * words.words.length)];
        console.log(`word ${word}`);
        // this.props.getGifs(word, (response) => {
        //     const gifs = response.data.game;
        //     console.log('got gifs');
        //     console.log(gifs);
        // });
        this.props.setUserGifs(word, (response) => {
            console.log('got gifs');
            console.log(response);
        });
        // new user connected send update to server
        socket.on('connect', () => {
            console.log('new user ' + this.props.currentUser.username + ' joined: connected');
            // update users on new user connect
            if (this.props.currentUser.username !== undefined) {
                this.props.updateGameUsers(this.props.currentUser.username, params.gameId, (response) => {
                    console.log('users have been updated');
                    console.log(response);
                });
            }
        });
        // new user disconnected send update to server
        socket.on('disconnect', () => {
            console.log('user ' + this.props.currentUser.username + ' has disconnected');
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
            // update wins
            if(response.user === this.props.currentUser.username) {
                store.dispatch({ type: UPDATE_WINS, payload: 1 });
            }
            // reset game
            setTimeout(() => {
                const next = getNext(this.props.game.users, this.props.game.current_turn);
                console.log('Next player is ---> ' + next);
                // get new gifs
                const newWord = words.words[~~(Math.random() * words.words.length)];
                this.props.setUserGifs(newWord, (response) => {
                    console.log('got new gifs');
                    console.log(response);
                });
                // reset game for next round
                // store.dispatch({ type: UPDATE_WINNER, payload: '' });
                // store.dispatch({ type: UPDATE_WINNING_CARD, payload: '' });
                store.dispatch({ type: CLEAR_CARDS, payload: [] })
                store.dispatch({ type: UPDATE_WINNER_CHOSEN, payload: false });
                store.dispatch({ type: UPDATE_CURRENT_TURN, payload: next });
                store.dispatch({ type: CARD_SELECTED, payload: false });
            }, 3000);
        });
    }

    render() {
        const { match: { params } } = this.props;
        // user list
        let users = '';
        if (Array.isArray(this.props.game.users)) {
            users = this.props.game.users.map((user, key) => <li key={key}>{user}</li>);
        }
        // display views
        let view;
        if (this.props.game.current_turn === this.props.currentUser.username) {
            view = <KingView users={users} />
        }else{
            view = <JesterView users={users} />
        }
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>Cuerrent Room: {this.props.game._id}</h3>
                        <p>Current Wins: {this.props.currentUser.wins}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Chat gameId={ params.gameId } socket={ socket }/>
                    </Col>
                    {view}
                </Row>
            </Container>
        );
    }
}

function getNext(all, user) {
    console.log('Next -------->');
    console.log('all users;');
    console.log(all);
    console.log('user:');
    console.log(user);
    const index = all.indexOf(user);
    let nextUser;
    if(index >= 0 && index < all.length -1) {
        nextUser = all[index + 1];
        console.log('not last');
    }else{
        nextUser = all[0];
        console.log('last');
    }
    console.log('next user: ' + nextUser);
    console.log('End of Next -------->')
    return nextUser;
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