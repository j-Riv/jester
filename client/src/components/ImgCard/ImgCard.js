import React from 'react';
import Col from 'react-bootstrap/Col';
import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';
import './ImgCard.css';

class ImgCard extends React.Component {
    render() {
        return (
            <Col xs={12} sm={12} md={4} lg={4} className="card-wrapper" style={{ backgroundImage: `url(${this.props.img})` }} onClick={() => this.props.onSelect()}>
                <Card>
                </Card>
            </Col>
        );
    }
}

export default ImgCard;