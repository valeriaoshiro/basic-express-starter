import React from 'react';
import ReactDOM from 'react-dom';

import IndexPage from './components/indexPage';

function init() {
    console.log('index file');

    ReactDOM.render(
        <IndexPage />,
        document.getElementById('container')
    );
}

document.addEventListener('DOMContentLoaded', init);
