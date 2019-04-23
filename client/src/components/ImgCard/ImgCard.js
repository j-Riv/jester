import React from 'react';
import Col from 'react-bootstrap/Col';
// import CardColumns from 'react-bootstrap/CardColumns';
// import Card from 'react-bootstrap/Card';
import './ImgCard.css';

class ImgCard extends React.Component {
    clicked = () => {
        console.log('you already chose the winning card!')
    }
    style = {
        backgroundImage: `url(${this.props.img})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: 'white',
    }
    render() {
        let chosen = false;
        let animation = 'fadeIn'
        return (
            <Col xs={12} sm={12} md={4} lg={4} className={'card-wrapper animated ' + animation} style={this.style} 
                onClick={() => {
                    animation = 'zoomOutUp';
                    if (chosen) {
                        this.clicked()
                    } else {
                        setTimeout(this.props.onSelect(), 1000)
                        chosen = true;
                    }                  
                }}>
                <div className='overlay-shadow'>
                </div>
                {/* <Card>
                </Card> */}
            </Col>
        );
    }
}

export default ImgCard;