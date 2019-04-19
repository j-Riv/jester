import React, { Component } from 'react';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';

class NSFW extends Component {
    renderNSFWGames(){
        let props = this.props;
        const nsfwGames = props.peeps.filter(g => g.category === 'Not Safe For Work')
        const nsfw = nsfwGames.map(item=> {
                return (
                    <div>
                        <Row key={item.id}>
                        
                            <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <h5>Creator: {item.username}</h5>
                                    {/* <Image src={item.image} roundedCircle /> */}
                                </div>
            
                            </Col>
            
                            <Col md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <Link to={`/room/${item._id}`}>
                                    <h3>{item.game_name}</h3>
                                    <p>{item.users.length}/{item.max_players}</p>
                                    </Link>
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