import React, { Component } from 'react';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

class NSFW extends Component {
    renderNSFWGames(){
        let props = this.props;
        const nsfwGames = props.peeps.filter(g => g.category === 'NSFW')
        const nsfw = nsfwGames.map(item=> {
            console.log(item.gameName)
            console.log(item.category)
                return (
                    <div>
                        <Row key={item.id}>
                        
                            <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <h5>{item.name}</h5>
                                    <Image src={item.image} roundedCircle />
                                </div>
            
                            </Col>
            
                            <Col md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <h3>{item.gameName}</h3>
                                    <p>{this.props.players}/{item.maxPlayers}</p>
                                </div>
            
                            </Col>
            
                            <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <p>{item.category}</p>
                                    <p>{item.status}</p>
                                </div>
                            </Col>
            
                        </Row>
                    </div>
                )
        })
        console.log(nsfw, 'hello')
        return nsfw.length > 0 ? nsfw : <p>no game to show</p>
    };
        
    render(){
        return(
            <div>
                {this.renderNSFWGames()}
            </div>
        )
    }
    
}

export default NSFW;