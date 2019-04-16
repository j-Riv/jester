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
// import './JesterView.css';

class JesterView extends React.Component {

    onCardClick(src) {
        const card = {
            user: this.props.currentUser.username,
            card: src,
            gameId: this.props.game._id
        }
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
                view = <div>
                    {this.props.game.winner === this.props.currentUser.username ? <p>You Won!</p> : <p>The winner is: {this.props.game.winner}</p>}
                    <p>The Winning card is:</p>
                    <img src={this.props.game.winning_card} alt={this.props.game.winner} />
                </div>
            } else if (this.props.currentUser.card_selected) {
                view = <p>You have already selected a card.</p>;
            } else {
                view = this.props.currentUser.images.map((img, key) =>
                    <ImgCard
                        key={key}
                        img={img.media[0].gif.url}
                        onSelect={() => this.onCardClick(img.media[0].gif.url)}
                    />
                );
            }
        }
        return (
            <Col sm={8} className="order-sm-2">
                <p>Jester: {this.props.currentUser.username}</p>
                <ul>
                    {this.props.users}
                </ul>
                <p>Images:</p>
                <Row>
                    {view}
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
)(JesterView);