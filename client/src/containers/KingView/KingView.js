import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import ImgCard from '../../components/ImgCard/ImgCard';
import PlayerCard from '../Game/PlayerCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import store from '../../store';
import {
    CARD_SELECTED
} from '../../actions/types';

class KingView extends React.Component {

    componenentDidMount = () => {
        store.dispatch({ type: CARD_SELECTED, payload: false });
    }
    
    onCardClick(src, user) {
        const nextUser = this.props.getNext(this.props.game.users, this.props.game.current_turn);
        const winnerData = {
            user: user,
            card: src,
            gameId: this.props.game._id,
            nextUser: nextUser
        }
        this.props.winnerChosen(winnerData, this.props.game.category);
        store.dispatch({ type: CARD_SELECTED, payload: true });
    }

    remainingPlayers() {
        if (this.props.game.users.length === 1) {
            return <p>Waiting for more players!</p>;
        } else {
            let rem = this.props.game.users.length - this.props.game.images.length - 1;
            if (this.props.currentUser.card_selected) {
                return <p>You have chosen!</p>;
            } else if (rem === 0) {
                return <p className="animated fadeIn heartBeat">Choose an image!</p>;
            } else if (rem > 1) {
                return <p className="animated fadeIn heartBeat">{'Waiting for ' + rem + ' images.'}</p>;
            } else {
                return <p className="animated fadeIn heartBeat">{'Waiting for ' + rem + ' image.'}</p>;
            }
        }
    }

    render() {
        // chosen images
        let chosenImages = '';
        if (Array.isArray(this.props.game.images) && this.props.currentUser.card_selected === false) {
            chosenImages = this.props.game.images.map((img, key) =>
                <ImgCard
                    key={key}
                    img={img.card}
                    onSelect={() => {this.onCardClick(img.card, img.user);}}
                />
            );
        }

        return (
            <Container id="viewComponent" style={{ height: "auto" }}>
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
                                }else{
                                    return '';
                                }
                            })}
                        </Row>
                        <h3 className="text-center my-3">{this.props.game.phrase ? '"' + this.props.game.phrase + '"' : 'Loading Phrase'}</h3>
                        <Row>
                            {this.props.game.users.map((e, i) => {
                                if (e.data.username !== this.props.game.current_turn) {
                                    return <PlayerCard
                                                total={this.props.users.length}
                                                user={e}
                                                key={i}
                                                selected={this.props.currentUser.card_selected}
                                            />
                                }else{
                                    return '';
                                }
                            })}
                        </Row>
                        <div className="p-2">
                            {this.remainingPlayers()}
                        </div>
                        <Row>
                            {chosenImages}
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
)(KingView);