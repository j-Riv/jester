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
        console.log('card clicked');
        console.log(winnerData);
        this.props.winnerChosen(winnerData);
        store.dispatch({ type: CARD_SELECTED, payload: true });
    }

    render() {
        // chosen images
        let chosenImages = '';
        if (Array.isArray(this.props.game.images)) {
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
                        <p className='animated fadeIn'>{chosenImages.length === 0 ? 'Waiting for other players' : 'Choose an Image!'}</p>
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