import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

class PlayerCard extends Component {
    render() {
        return (
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <img src={this.props.image} alt={this.props.image} />
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}

export default PlayerCard;