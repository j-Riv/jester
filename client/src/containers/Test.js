import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import requireAuth from '../containers/requireAuth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Chat from './Chat';

class Test extends Component {
    onSubmit = formProps => {
        formProps.id = this.props.currentUser._id;
        console.log(formProps);
        this.props.updateUser(formProps, () => {
            console.log('submitted');
        });
    };

    handleNewGame = () => {
        this.props.createGame((response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/chat/' + game._id);
        });
    }

    componentDidMount = () => {
        // get game object
        const { match: { params } } = this.props;
        this.props.getGame(params.gameId, (response) => {
            const game = response.data.game;
            console.log(game);
        });
    }

    render() {
        const { match: { params } } = this.props;
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
)(requireAuth(Test));