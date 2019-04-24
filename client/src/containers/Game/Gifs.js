import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import words from '../../words/words-clean';

class Gifs extends Component {
    state = {
        gifs: []
    }

    // componentDidMount = () => {
    //     console.log('component')
    //     const word = words.words[~~(Math.random() * words.words.length)];
    //     console.log(word)
    //     axios.get(`https://api.tenor.com/v1/search?tag=${word}&limit=7&media_filter=minimal&key=OZVKWPE1OFF3`)
    //     .then(data => {
    //         data.data.results.forEach(e => {
    //             const img = e.media[0].tinygif.url;
    //             this.setState({ gifs: [...this.state.gifs, img]});
    //         });
    //         console.log(this.state.gifs)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // }

    renderGifs = () => {
        console.log('render')
        this.props.gifs.forEach(e => {
            const img = e.media[0].tinygif.url;
            // console.log(img)
            return (
                <Col md='3'>
                    <img src={img} alt={img}  />
                </Col>
            )
        })

    }
    // getGifs = () => {
    //     const word = words.words[~~(Math.random() * words.words.length)];
    //     console.log(word)
    //     axios.get(`https://api.tenor.com/v1/search?tag=${word}&limit=7&media_filter=minimal&key=OZVKWPE1OFF3`)
    //     .then(data => console.log(data.data.results))
    //     .catch(err => {if (err) {console.log(err)}})
    // }

    render() {
        return (
            <Row>
                {/* {this.renderGifs()} */}
            </Row>
        )
    }
}

export default Gifs;