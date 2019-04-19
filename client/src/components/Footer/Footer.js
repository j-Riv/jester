import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './footer.css';

class Footer extends React.Component {
    render() {
        return (
            <div className="site-footer">
                <Container>
                    <Row>
                        <Col className=" md={8} xs={6} d-flex justify-content-center sm={6} ">
                            © 2019 Wacky Waving Inflatable Flailing Arm Tube Men
                        </Col>
                        <Col className= " md={8} xs={6} d-flex justify-content-end sm={6} ">
                            <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><i className="fas fa-code"></i></a>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Footer;