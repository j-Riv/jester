import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Search from '../searchLobby/searchLobby';
import peeps from '../peeps.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { All, SFW, NSFW } from '../GameTabs';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../.././../actions';
import requireAuth from '../../../containers/requireAuth';


class GamesLobby extends Component {

    state = {
        peeps,
        players: 0,
        key: 'allGames'
    }
    
    componentDidMount = () => {
        // fetch games
        this.props.getAllGames((response) => {
            const games = response.data.games;
            console.log('these should be all the games currently in db:');
            console.log(games);
        });
    }

    render() {
        if (this.props.loading) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                <Container>
                <Search />
                <Tabs id="game-tabs" activeKey={this.state.key} onSelect={key => this.setState({ key })}>
                    <Tab eventKey="allGames" title="All Games">
                    <All peeps={this.state.peeps} players={this.state.players}/>
                    </Tab>

                    <Tab eventKey="sfwGames" title="SFW Games">
                    <SFW peeps={this.state.peeps}/>
                    </Tab>

                    <Tab eventKey="nsfwGames" title="NSFW Games">
                    <NSFW peeps={this.state.peeps}/>
                    </Tab>
                    
                </Tabs>
                {/* {this.state.peeps.map(item => (
                    <Row key={item.id}>

                        <Col md={3} style={{display: 'flex', justifyContent: 'center'}}>
                            <div>
                                <h5>Creator: {game.username}</h5>
                                <Image src={game.image} roundedCircle />
                            </div>

                                </Col>

                                <Col md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div>
                                        <Link to={`/room/${game._id}`}>
                                            <h3>Name: {game.game_name}</h3>
                                            <p>Players: 0/{game.max_players}</p>
                                        </Link>
                                    </div>

                                </Col>

                        <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <p>Category: {game.category}</p>
                                <p>Status: {game.status}</p>
                            </div>
                        </Col>
                    </Row>
                ))} */}
                </Container>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        game: state.game.game,
        currentUser: state.currentUser.user,
        lobby: state.lobby.games.all,
        loading: state.lobby.games.loading
    };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(GamesLobby));