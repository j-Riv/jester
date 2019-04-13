import React, { Component } from 'react';
import Search from '../searchLobby/searchLobby';
import peeps from '../peeps.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';



class GamesLobby extends Component {
    state = {
        peeps,
        players: 0,


    }





    render() {
        return(
            <div>
                <Container>
                <Search />
                {this.state.peeps.map(item => (
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
                ))}
                </Container>
            </div>
        )
    }


};

export default GamesLobby; 