import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { isMobile } from 'react-device-detect';

class PlayerCard extends Component {
    style = {
        picture: {
            width: isMobile ? '90px' : '125px',
            height: isMobile ? '90px' : '125px',
            backgroundImage: 'url(' + this.props.user.data.picture + ')',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundColor: 'white',
            zIndex: '2'
        },
        light: {
            width: isMobile ? '97px' : '135px',
            height: isMobile ? '97px' : '135px',
            backgroundColor: 'transparent'
        },
        selected: {
            width: isMobile ? '97px' : '135px',
            height: isMobile ? '97px' : '135px',
            backgroundColor: '#42f49e'
        },
        crown: {
            color: '#ffbd07',
            fontSize: isMobile ? '1em' : '2em',
            paddingBottom: '5px'
        }
    }

    render() {
        let colSize = 12;
        let icon = '';
        let animate = 'animated fadeInRight';
        const total = this.props.total;
        total >= 5 ? colSize = 3 : total === 4 ? colSize = 4 : total === 3 ? colSize = 6 : total <= 2 ? colSize = 12 : colSize = 12;
        if (this.props.king) { colSize = 12; animate = 'animated fadeInLeft' }
        if (this.props.user.data.username === this.props.currentUser.username) {
            icon = 'fas fa-user mr-1';
        }
        return (
            <Col md={colSize} className={animate}>
                {/* <h3>{isMobile ? 'On Mobile' : 'On Browser'}</h3> */}
                {this.props.king ? <div className='d-flex justify-content-center'><i className='fas fa-crown' style={this.style.crown}></i></div> : null}
                <div className='rounded-circle mx-auto d-flex align-items-center' style={this.props.king ? null : this.props.currentUser.card_selected ? this.style.selected : this.style.light}>
                    <div className='rounded-circle mx-auto border border-secondary' style={this.style.picture}>
                    </div>
                </div>
                <div>
                    <p className='mb-1'><i className={icon}></i>{this.props.user.data.username} | {this.props.user.wins}</p>
                    {/* <p className='mb-1'>{this.props.user.wins}</p> */}
                </div>
                {/* {!this.props.king ? <div><p>{this.props.user.wins}</p></div> : null} */}
            </Col>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser.user
    };
}

export default compose(
    connect(mapStateToProps, actions),
)(PlayerCard);