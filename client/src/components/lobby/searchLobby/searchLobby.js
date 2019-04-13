import React, { Component } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';


class Search extends Component {
    render() {
        return(
            <div>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Search for a Game"
                        aria-label="Search for a Game"
                        aria-describedby="game-search"
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )
    }
}

export default Search;