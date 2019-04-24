import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function All(props) {
    return (
        <div className='mt-3'>
            <Row className='px-3'>
                <Col md={3}>
                    <h4>
                        King
                    </h4>
                </Col>
                <Col md={6}>
                    <h4>
                        Room
                    </h4>
                </Col>
                <Col md={3}>
                    <h4>
                        Category
                    </h4>
                </Col>
            </Row>
            {props.peeps.map(item => {
                return (
                    <Card bg='dark' className='mb-3'>
                        <Card.Body>
                            <Row key={item._id}>

                                <Col md={3} style={{ display: 'flex', justifyContent: 'start' }}>
                                    <div>
                                        <p>{item.username}</p>
                                        {/* <Image src={item.image} roundedCircle /> */}
                                    </div>

                                </Col>

                                <Col md={6} style={{ display: 'flex', justifyContent: 'start' }}>
                                    <div>
                                        <Link to={`/room/${item._id}`}>
                                            <p>{item.game_name} | {item.users.length}/{item.max_players}</p>
                                            {/* <p>{item.users.length}/{item.max_players}</p> */}
                                        </Link>
                                    </div>

                                </Col>

                                <Col md={3} style={{ display: 'flex', justifyContent: 'start' }}>
                                    <div>
                                        <p>{item.category} | {item.status}</p>
                                    </div>
                                </Col>

                            </Row>
                        </Card.Body>
                    </Card>
                )
            })}
        </div>
    )
}

export default All;