import React, { Component } from 'react';
import requireAuth from './requireAuth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Protected extends Component {
    render() {
        return(
            <Container>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>You are signed in. This is a protected route!</h3>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default requireAuth(Protected);