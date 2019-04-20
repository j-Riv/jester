import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './footer.css';
import { connect } from 'react-redux';

class Footer extends React.Component {
    render() {
        if (this.props.authenticated) {
    

        return (
            <div className="site-footer1">
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
else {
    return (
<div className="site-footer2" >
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
    }}
}
function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
}
export default connect(mapStateToProps)(Footer);