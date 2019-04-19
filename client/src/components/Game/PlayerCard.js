import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

class PlayerCard extends Component {
    render() {
        if (this.props.total >= 5) {
            return (
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <img src={this.props.image} alt={this.props.image} />
                            <p>{this.props.user}</p>
                        </Card.Body>
                    </Card>
                </Col>
            )
        } else if (this.props.total === 4) {
            return (
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <img src={this.props.image} alt={this.props.image} />
                            <p>{this.props.user}</p>
                        </Card.Body>
                    </Card>
                </Col>
            )
        } else if (this.props.total === 3) {
            return (
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <img src={this.props.image} alt={this.props.image} />
                            <p>{this.props.user}</p>
                        </Card.Body>
                    </Card>
                </Col>
            )
        } else {
            return (
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <img src={this.props.image} alt={this.props.image} />
                            <p>{this.props.user}</p>
                        </Card.Body>
                    </Card>
                </Col>
            )
        }
    }
}

export default PlayerCard;