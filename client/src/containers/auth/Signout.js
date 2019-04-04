import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Signout extends Component {
    componentDidMount() {
        this.props.signout();
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3>You have been logged out.</h3>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(null, actions)(Signout);