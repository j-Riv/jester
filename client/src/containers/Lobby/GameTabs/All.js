import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';


class All extends Component {
    renderAll() {
        const props = this.props;
        if(props.peeps.length <= 0) {
            return <h1 className="emptyGames">No Games Available</h1>;
        }else{
            return (
                <div>
                    {props.peeps.map(item => {
                        return (
                            <Row className="game-row" key={item._id}>

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
                                            <p>{item.users.length} players in game</p>
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
                        )
                    })}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderAll()}
            </div>
        );
    }
}

export default All;