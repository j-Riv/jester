import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import words from '../words/words-clean';

class Test extends Component {
    state = {
        query: ''
    }

    handleChangeInput = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    search = () => {
        const query = this.state.query;
        console.log(query)
        axios.get(`https://api.tenor.com/v1/search?tag=${query}&limit=7&media_filter=minimal&key=OZVKWPE1OFF3`)
        .then(data => console.log(data))
        .catch(err => {if (err) {console.log(err)}})
    }

    componentDidMount = () => {
        // Pick a random word
        const word = words.words[~~(Math.random() * words.words.length)];
        console.log(word)
        axios.get(`https://api.tenor.com/v1/search?tag=${word}&limit=7&media_filter=minimal&key=OZVKWPE1OFF3`)
        .then(data => console.log(data.data.results))
        .catch(err => {if (err) {console.log(err)}})
    }

    render() {
        return (
            <Container>
                <Form>
                    <Form.Control 
                    type='text'
                    name='query'
                    placeholder='Search Random Tenor Gifs'
                    value={this.state.query}
                    onChange={this.handleChangeInput}/>
                </Form>
                <Button onClick={this.search}>
                    Search
                </Button>
            </Container>
        )
    }
}

export default Test;