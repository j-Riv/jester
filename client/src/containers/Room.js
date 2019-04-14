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
import ImgCard from '../components/ImgCard/ImgCard';
import words from '../words/words-clean';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
    transports: ['websocket']
});

class Game extends Component {
    componentWillMount = () => {
        // get game object
        const { match: { params } } = this.props;
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log('this is the game');
            console.log(game);
        });
    }

    componentDidMount = () => {
        // get gifs
        // const word = words.words[~~(Math.random() * words.words.length)];
        // console.log(`word ${word}`)
        // this.props.getGifs(word, (response) => {
        //     const gifs = response.data.game;
        //     console.log('got gifs');
        //     console.log(gifs);
        // });
        const word = words.words[~~(Math.random() * words.words.length)];
        console.log(`word ${word}`)
        this.props.setUserGifs(word, (response) => {
            console.log('got gifs');
            console.log(response);
        });
        // new user connected send update to server
        socket.on('connect', () => {
            console.log('new user ' + this.props.currentUser.username + ' joined: connected');
            socket.emit('user joined', { room: this.props.game._id, newUser: this.props.currentUser.username });
        });
        // new user disconnected send update to server
        socket.on('disconnect', () => {
            console.log('user ' + this.props.currentUser.username + ' has disconnected');
            socket.emit('user disconnected', { room: this.props.game._id, lostUser: this.props.currentUser.username });
        });
        // update users on new user connect
        socket.on('upr-' + this.props.game._id, (r) => {
            console.log('Client has added user: ' + r);
            let users = this.props.game.users;
            if (!users.includes(r)) {
                if(r !== null) {
                    users.push(r);
                }
            }
            const data = {
                gameId: this.props.game._id,
                users: users
            }
            this.props.updateGameUsers(data, (response) => {
                console.log('users have been updated');
                console.log(response);

            });
        });
        // update chosen card
    }

    onCardClick(src) {
        const card = {
            user: this.props.currentUser.username,
            src: src,
            room: this.props.game._id
        }
        console.log('card clicked');
        console.log(card);
        this.props.imgCardChosen(card);
    }

    render() {
        const { match: { params } } = this.props;
        let theImages = '';
        if (Array.isArray(this.props.currentUser.images)) {
            theImages = this.props.currentUser.images.map((img, key) =>
                <ImgCard
                    key={key}
                    img={img}
                    onSelect={() => this.onCardClick(img.media[0].gif.url)}
                />
            );
        }
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>Cuerrent Room: {this.props.game._id}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Chat gameId={ params.gameId } socket={ socket }/>
                    </Col>
                    <Col sm={8}>
                        <p>Images:</p>
                        <Row>
                            {theImages}
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

// export default requireAuth(Protected);

function mapStateToProps(state) {
    return { 
        game: state.game.game,
        currentUser: state.currentUser.user
     };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(Game));