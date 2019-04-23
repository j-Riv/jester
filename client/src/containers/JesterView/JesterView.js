import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import ImgCard from '../../components/ImgCard/ImgCard';
import PlayerCard from '../../components/Game/PlayerCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import store from '../../store';
import {
    CARD_SELECTED
} from '../../actions/types';
import './jesterview.css';

class JesterView extends React.Component {
    componenentDidMount = () => {
        store.dispatch({ type: CARD_SELECTED, payload: false });
    }

    onCardClick(src) {
        const card = {
            user: this.props.currentUser.username,
            card: src,
            gameId: this.props.game._id
        }
        console.log('card src')
        console.log(src)
        console.log('card clicked');
        console.log(card);
        this.props.imgCardChosen(card);
        store.dispatch({ type: CARD_SELECTED, payload: true });
    }

    render() {
        // card images
        let view = '';
        if (Array.isArray(this.props.currentUser.images)) {
            if (this.props.currentUser.card_selected && this.props.game.winner_chosen === true) {
                view = <Col sm={12} className="text-center">
                            {this.props.game.winner === this.props.currentUser.username ? <h4>You Won!</h4> : <h4>The winner is: {this.props.game.winner}</h4>}
                            <h6>The Winning card is:</h6>
                            <img id="winningCard" src={this.props.game.winning_card} alt={this.props.game.winner} />
                        </Col>
            } else if (this.props.currentUser.card_selected) {
                view = <Col sm={12} className="text-center">
                            <p>You have already selected a card.</p>
                        </Col>
            } else {
                view = this.props.currentUser.images.map((img, key) =>
                    <ImgCard
                        key={key}
                        img={img}
                        onSelect={() => this.onCardClick(img)}
                    />
                );
            }
        }
        return (
            <Container fluid={true} id="viewComponent">
                <Row>
                    <Col sm={12}>
                        <Row>
                            {this.props.game.users.map(e => {
                                if (e.data.username === this.props.game.current_turn) {
                                    return <PlayerCard
                                    key={1}
                                    user={e}
                                    king={true}
                                    />
                                }
                            })}
                        </Row>
                        <h3 className="text-center my-3">{this.props.game.phrase ? '"' + this.props.game.phrase + '"' : 'Loading'}</h3>
                        <Row>
                            {this.props.game.users.map((e, i) => {
                                if (e.data.username !== this.props.game.current_turn) {
                                    return <PlayerCard
                                    total={this.props.users.length}
                                    user={e}
                                    key={i}
                                    />
                                }
                            })}
                        </Row>
                        <h4>Select a GIF!</h4>
                        <Row>
                            {view}
                        </Row>
                    </Col>
                </Row>
            </Container>
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
)(JesterView);