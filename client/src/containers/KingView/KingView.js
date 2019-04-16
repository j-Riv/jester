import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import ImgCard from '../../components/ImgCard/ImgCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import store from '../../store';
import {
    CARD_SELECTED
} from '../../actions/types';
// import './KingView.css';

class KingView extends React.Component {
    
    onCardClick(src, user) {
        const card = {
            user: user,
            card: src,
            gameId: this.props.game._id
        }
        console.log('card clicked');
        console.log(card);
        this.props.winnerChosen(card);
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
                    onSelect={() => this.onCardClick(img.card, img.user)}
                />
            );
        }
        return (
            <Col sm={8} className="order-sm-2">
                <p>King: {this.props.currentUser.username}</p>
                <ul>
                    {this.props.users}
                </ul>
                <p>Your Image/Phrase</p>

                <p>Chosen Images:</p>
                <Row>
                    {chosenImages}
                </Row>
            </Col>
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