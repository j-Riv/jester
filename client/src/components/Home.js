import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Home extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>Welcome! Sign up or sign in!</h3>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;