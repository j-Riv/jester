import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './footer.css';
import { connect } from 'react-redux';

class Footer extends React.Component {
    render() {
        return (
            <div className="site-footer gray" >
                <Container>
                    <Row>
                    <Col xs={6} sm={6} md={6} lg={6} className="text-left">
                            © 2019 Wacky Waving Inflatable Flailing Arm Tube Men
                        </Col>
                    <Col xs={6} sm={6} md={6} lg={6} className="text-right">
                            <a className="text-white" href="https://github.com/j-Riv/project_3" target="_blank" rel="noopener noreferrer"><i className="fas fa-code"></i></a>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
    

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
}
export default connect(mapStateToProps)(Footer);