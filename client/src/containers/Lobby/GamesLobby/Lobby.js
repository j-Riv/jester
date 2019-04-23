import React, { Component } from 'react';
import io from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import All from '../GameTabs/All';
import SFW from '../GameTabs/SFW';
import NSFW from '../GameTabs/NSFW';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import requireAuth from '../../../containers/requireAuth';
import CreateGameModal from '../../../containers/CreateGameModal/CreateGameModal';
import hostname from '../../../config/config';
import Profile from '../../Profile/Profile';
import { push as Menu } from 'react-burger-menu';
import './lobby.css';


const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

class GamesLobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profileOpen: false,
            showCreatedGame: false,
            key: 'allGames'
        }
    }

    // This keeps your state in sync with the opening/closing of the menu
    handleStateChange(state, menu) {
        this.setState({ [menu]: state.isOpen });
    }
    // This can be used to close the menu, e.g. when a user clicks a menu item
    closeMenu(menu) {
        this.setState({ [menu]: false });
    }
    // This can be used to toggle the menu, e.g. when using a custom icon
    toggleMenu(menu) {
        this.setState({ [menu]: !this.state.menuOpen });
    }
    
    componentDidMount = () => {
        document.body.classList.add('lobby');
        // fetch games
        this.props.getAllGames();
        // get current user
        let token = localStorage.getItem('token');
        if (!token || token === '') {//if there is no token, dont bother
            return;
        }
        // fetch user from token (if server deems it's valid token)
        this.props.getCurrentUser(token, (response) => {
            console.log(response);
        });
        // on new game added re fetch
        socket.on('game added', () => {
            this.props.getAllGames();
        });
        // on user left update games
        socket.on('update games', () =>{
            this.props.getAllGames();
        });
    }

    componentWillUnmount = () => {
        document.body.classList.remove('lobby');
    } 

    handleNewGame = () => {
        this.props.createGame((response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/room/' + game._id);
        });
    }

    handleClickCreate = () => {
        this.setState({ showCreateGame: true });
    }

    render() {
        const closeCreateGame = () => this.setState({ showCreateGame: false });
        if (this.props.loading) {
            return <div>Loading...</div>;
        }
        return (
            <div id="lobbyOuter">
                
                    <CreateGameModal
                        show={this.state.showCreateGame}
                        onHide={closeCreateGame}
                    />
                    <Menu
                        right
                        isOpen={this.state.profileOpen}
                        onStateChange={(state) => this.handleStateChange(state, "profileOpen")}
                        customBurgerIcon={false}
                        pageWrapId={'lobby'}
                        outerContainerId={'lobbyOuter'}
                        customCrossIcon={<img src="/images/close.svg" alt="close" />}
                        id='profileSide'
                    >
                        <Profile />
                    </Menu>
                <Container fluid={true} id="lobby">
                    <Button variant="light" className="m-2" style={{ float: 'right' }} onClick={this.handleClickCreate}><i className="fas fa-plus"></i></Button>
                    <Button variant="light" className="m-2" style={{ float: 'right' }} onClick={() => this.toggleMenu('profileOpen')}><i className="fas fa-user-circle"></i> Profile</Button>
                    <Tabs id="game-tabs" activeKey={this.state.key} style={{ clear: 'both' }} onSelect={key => this.setState({ key })}>
                        <Tab eventKey="allGames" title="All Games" className="tab-select">
                            <All peeps={this.props.lobby} />
                        </Tab>

                        <Tab eventKey="sfwGames" title="SFW Games" className="tab-select">
                            <SFW peeps={this.props.lobby} />
                        </Tab>

                        <Tab eventKey="nsfwGames" title="NSFW Games" className="tab-select">
                            <NSFW peeps={this.props.lobby} />
                        </Tab>

                    </Tabs>
                </Container>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        game: state.game.game,
        currentUser: state.currentUser.user,
        lobby: state.lobby.games.all,
        loading: state.lobby.games.loading
    };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(GamesLobby));