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
                            {this.props.game.winner === this.props.currentUser.username ? <p>You Won!</p> : <p>The winner is: {this.props.game.winner}</p>}
                            <p>The Winning card is:</p>
                            <img id="winningCard" src={this.props.game.winning_card} alt={this.props.game.winner} />
                        </Col>
            } else if (this.props.currentUser.card_selected) {
                view = <Col sm={12} className="text-center">
                            <p>You have already selected a card.</p>
                        </Col>;
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
                        {/* <Container>
                            <p><i className="fas fa-user"></i> {this.props.currentUser.username}</p>
                        </Container> */}
                        <Row>
                            {this.props.users.map((e, i) => {
                                return <PlayerCard
                                total={this.props.users.length}
                                user={e}
                                key={i}
                                />
                            })}
                        </Row>
                        {/* <ul id="userList">
                            {this.props.users}
                        </ul> */}
                        <p className="text-center">{this.props.game.phrase}</p>
                        <p>Images:</p>
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