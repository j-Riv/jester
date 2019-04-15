import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import ImgCard from '../../components/ImgCard/ImgCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import './KingView.css';

class JesterView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardSelected: false
        }
    }

    onCardClick(src) {
        const card = {
            user: this.props.currentUser.username,
            card: src,
            gameId: this.props.game._id
        }
        console.log('card clicked');
        console.log(card);
        this.props.imgCardChosen(card);
        this.setState({ cardSelected: true });
    }

    render() {
        // card images
        let theImages = '';
        if (Array.isArray(this.props.currentUser.images)) {
            if (this.state.cardSelected) {
                theImages = <p>You have already selected a card.</p>;
            } else {
                theImages = this.props.currentUser.images.map((img, key) =>
                    <ImgCard
                        key={key}
                        img={img.media[0].gif.url}
                        onSelect={() => this.onCardClick(img.media[0].gif.url)}
                    />
                );
            }
        }
        return (
            <Col sm={8}>
                <p>Jester: {this.props.currentUser.username}</p>
                <ul>
                    {this.props.users}
                </ul>
                <p>Images:</p>
                <Row>
                    {theImages}
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