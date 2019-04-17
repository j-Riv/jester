import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

function All(props) {
    return (
        <div>
        {props.peeps.map(item => { return (
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
                        <p>{props.players}/{item.maxPlayers}</p>
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
    )
}

export default All;