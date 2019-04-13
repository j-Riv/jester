import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
const phrases = ['test phrase 1', 'test phrase 2', 'test phrase 3'];

class Phrase extends Component {
    state = {
        phrase: ''
    }

    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    randomPhrase = () => {
        const phrase = phrases[~~(Math.random() * phrases.length)]
        this.props.newPhrase(phrase);
    }

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Control 
                    type='text' 
                    placeholder='Type a phrase!'
                    name='phrase'
                    value={this.state.phrase}
                    onChange={this.handleInputChange}
                    />
                    <Button 
                    onClick={() => this.props.newPhrase(this.state.phrase)}
                    >Submit</Button>
                </Form.Group>
                <div className='text-center'>
                    <h3>Or</h3>
                </div>
                <div className='d-flex justify-content-center'>
                    <Button onClick={this.randomPhrase}>
                        Random Phrase
                    </Button>
                </div>
            </Form>
        )
    }
}

export default Phrase