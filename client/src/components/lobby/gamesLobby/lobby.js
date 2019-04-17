import React, { Component } from 'react';
import Search from '../searchLobby/searchLobby';
import peeps from '../peeps.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { All, SFW, NSFW } from '../GameTabs';

class GamesLobby extends Component {
    state = {
        peeps,
        players: 0,
        key: 'allGames'
    }

    render() {
        return(
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
                                <h5>{item.name}</h5>
                                <Image src={item.image} roundedCircle />
                            </div>
                            
                        </Col>

                        <Col md={6} style={{display: 'flex', justifyContent: 'center'}}>
                            <div>
                                <h3>{item.gameName}</h3>
                                <p>{this.state.players}/{item.maxPlayers}</p>
                            </div>
                            
                        </Col>

                        <Col md={3} style={{display: 'flex', justifyContent: 'center'}}>
                            <div>
                                <p>{item.category}</p>
                                <p>{item.status}</p>
                            </div>
                        </Col>

                    </Row>
                ))} */}
                </Container>
            </div>
        )
    }


};

export default GamesLobby; 