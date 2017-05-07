import React from 'react';
import ReactDOM from 'react-dom';

import UserListViewPage from './components/userListViewPage';
function init() {
    let users = [
        {
            name: "Dave",
            userData: {}
        },
        {
            name: "Tom",
            userData: {}
        },
        {
            name: "Jenna",
            userData: {}
        }
    ]
    ReactDOM.render(
        <UserListViewPage
            users={users}
        />,
        document.getElementById('dashboard')
    );
}
document.addEventListener('DOMContentLoaded', init);
