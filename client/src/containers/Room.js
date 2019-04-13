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

class Game extends Component {

    componentDidMount = () => {
        // get game object
        const { match: { params } } = this.props;
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log('this is the game');
            console.log(game);
        });
        // get gifs
        const word = words.words[~~(Math.random() * words.words.length)];
        console.log(`word ${word}`)
        this.props.getGifs(word, (response) => {
            const gifs = response.data.game;
            console.log('got gifs');
            console.log(gifs);
        });
    }

    render() {
        const { match: { params } } = this.props;
        let theImages = '';
        if (Array.isArray(this.props.game.images)) {
            theImages = this.props.game.images.map(img => <p>{img.itemurl}</p>)
        }
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>You are signed in. This is a protected route!</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Chat gameId={ params.gameId }/>
                    </Col>
                    <Col sm={8}>
                        <h2>Current Game Info:</h2>
                        <p>ID: {this.props.game._id}</p>
                        <p>Images:</p>
                        {theImages}
                    </Col>
                </Row>
            </Container>
        );
    }
}

// export default requireAuth(Protected);

function mapStateToProps(state) {
    return { game: state.game.game };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(Game));