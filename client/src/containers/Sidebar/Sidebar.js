import React from 'react';
import { push as Menu } from 'react-burger-menu';
import Chat from '../Chat/Chat';
import './Sidebar.css';

class Sidebar extends React.Component {
    render() {
        var styles = {
            bmBurgerButton: {
                position: 'fixed',
                width: '36px',
                height: '30px',
                left: '5px',
                top: '80%'
                // bottom: '0px'
            },
            bmBurgerBars: {
                background: '#373a47'
            },
            bmBurgerBarsHover: {
                background: '#a90000'
            },
            bmCrossButton: {
                height: '24px',
                width: '24px',
                color: '#000'
            },
            bmCross: {
                background: '#fff'
            },
            bmMenuWrap: {
                position: 'fixed',
                height: '100%'
            },
            bmMenu: {
                background: '#d3d3d3',
                padding: '2.5em 1.5em 0',
                fontSize: '1.15em'
            },
            bmMorphShape: {
                fill: '#373a47'
            },
            bmItemList: {
                color: '#fff',
                padding: '0.8em'
            },
            bmItem: {
                display: 'inline-block'
            },
            bmOverlay: {
                background: 'rgba(0, 0, 0, 0.3)'
            }
        }
        return (
            <Menu pageWrapId={'room'} outerContainerId={'roomOuter'} width={'100%'} customBurgerIcon={<img src="/images/chat.svg" />} styles={styles}>
                <Chat gameId={this.props.gameID} socket={this.props.socket} />
            </Menu>
        );
    }
}

export default Sidebar;