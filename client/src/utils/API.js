// import React from 'react';
import axios from 'axios';
require('dotenv').config();
const apiKey = process.env.REACT_APP_apiKey;

export default {
    search: query => axios(`https://api.tenor.com/v1/search?tag=${query}&limit=7&media_filter=minimal&key=${apiKey}`)
};