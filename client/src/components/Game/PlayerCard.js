import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class PlayerCard extends Component {
    style = {
        picture: {
            width: '125px',
            height: '125px',
            backgroundImage: 'url(' + this.props.user.data.picture + ')',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: '2'
        },
        light: {
            width: '135px',
            height: '135px',
            backgroundColor: 'transparent'
        },
        selected: {
            width: '135px',
            height: '135px',
            backgroundColor: '#42f49e'
        },
        crown: {
            color: '#ffbd07',
            fontSize: '2em',
            paddingBottom: '5px'
        }
    }

    render() {
        let colSize = 6;
        let icon = '';
        const total = this.props.total;
        total >= 5 ? colSize = 3 : total === 4 ? colSize = 4 : total === 3 ? colSize = 6 : total <= 2 ? colSize = 12 : colSize = 12;
        if (this.props.king) { colSize = 12 }
        if (this.props.user.data.username === this.props.currentUser.username) {
            icon = 'fas fa-user';
        }
        return (
            <Col md={colSize}>
                {this.props.king ? <div className='d-flex justify-content-center'><i className='fas fa-crown' style={this.style.crown}></i></div> : null}
                <div className='rounded-circle mx-auto d-flex align-items-center' style={this.props.king ? null : this.props.currentUser.card_selected ? this.style.selected : this.style.light}>
                    <div className='rounded-circle mx-auto border border-secondary' style={this.style.picture}>
                    </div>
                </div>
                <div>
                    <p><i className={icon}></i>{this.props.user.data.username}</p>
                </div>
                {!this.props.king ? <div><p>{this.props.user.wins}</p></div> : null}
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