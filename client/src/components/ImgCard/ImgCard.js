import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './ImgCard.css';

class ImgCard extends React.Component {
    render() {
        return (
            <Col xs={4} sm={3} md={2} lg={2} className="card-wrapper">
                <Card onClick={() => this.props.onSelect()}>
                    <Card.Body>
                        <img className="w-100" src={`${this.props.img}`} alt={`Card`} />
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default ImgCard;