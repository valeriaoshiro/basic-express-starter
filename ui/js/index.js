import React from 'react';
import ReactDOM from 'react-dom';

import IndexPage from './components/indexPage';

function init() {
    // This is the index page
    const userLoggedIn = document.getElementById('loggedInIndexPage');
    if(userLoggedIn) {
        ReactDOM.render(
            <IndexPage />,
        userLoggedIn
        );
    }
}

document.addEventListener('DOMContentLoaded', init);
