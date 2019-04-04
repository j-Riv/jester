import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import store from '../store/index';

import { connect } from 'react-redux';

class Home extends Component {
    render() {
        function setColor(color) {
            return {
                type: "SET_COLOR",
                payload: color
            }
        }

        function dispatchBtnAction(e) {
            const color = e.target.dataset.color;
            console.log('btn clicked');
            console.log(color);
            store.dispatch(setColor(color))
            console.log(store.getState().color);
        }
        console.log(store.getState().color);
        return (
            <Container>
                <Row>
                    <Col sm={12} className="text-center">
                        <h3 style={ { color: `${this.props.color}`} }>Welcome! Sign up or sign in!</h3>
                        <Button variant="secondary" data-color="red" onClick={dispatchBtnAction}>Red</Button>
                        <Button variant="secondary" data-color="black" onClick={dispatchBtnAction}>Black</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return { color: state.color.color };
}

export default connect(mapStateToProps)(Home);