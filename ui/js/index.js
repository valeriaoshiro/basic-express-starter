import React from 'react';
import ReactDOM from 'react-dom';

import IndexPage from './components/indexPage';

function init() {
    // This is the index page
    console.log('Index Page');
    ReactDOM.render(
        <IndexPage />,
        document.getElementById('loggedInIndexPage')
    );
}

document.addEventListener('DOMContentLoaded', init);
