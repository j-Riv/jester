import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import PlayerCard from '../components/Game/PlayerCard';
import Row from 'react-bootstrap/Row';
import Phrase from '../components/Game/Phrase';
import Gifs from '../components/Game/Gifs';
// import Button from 'react-bootstrap/Button';
import axios from 'axios';
import words from '../words/words-clean';

class GameContainer extends Component {
    state = {
        user: 'david',
        king: 'tyler',
        players: ['david', 'miguel', 'jose'],
        turnEnd: false,
        selectGif: false,
        isKing: false,
        phrase: '',
        playerGifs: [],
        userGifs: []
    }

    addGif = gif => {
        this.setState({
            selectGif: true,
            playerGifs: [...this.state.gifs, gif]
        });
    }

    newTurn = () => {
        const s = this.state;
        if (!s.players.includes(s.king)) {
            s.players.push(s.king)
            this.setState({ king: s.player[0]})
        }
    }

    newPhrase = phrase => {
        this.setState({ phrase: phrase })``
    }


    renderTurn = () => {
        const s = this.state;
        return s.user === s.king ? <Phrase newPhrase={this.newPhrase}/> : <Gifs addGif={this.addGif} gifs={this.state.userGifs} />
    }

    render() {
        return (
            <Container>
                <div className='d-flex justify-content-center'>
                    <PlayerCard image={this.state.king} />
                </div>
                <Row>
                    {this.state.players.map((e, i) => <PlayerCard image={e} key={i} />)}
                </Row>
                {this.renderTurn()}
            </Container>
        )
    }
}

export default GameContainer;