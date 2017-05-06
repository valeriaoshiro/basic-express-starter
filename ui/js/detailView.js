import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import ApplicantsPage from './components/githubDetailView';
import '../scss/base.scss';

function init(){
    console.log('hey!');
    const USERNAME = 'merlineray';
    axios.get(`https://api.github.com/users/${USERNAME}`).then(
        (resp) => {
            console.log(resp);
            let userData = resp.data;
            axios.get(`https://api.github.com/users/${USERNAME}/repos`).then(
                (repoResp) => {
                    console.log(repoResp);
                    ReactDOM.render(
                        <ApplicantsPage
                            username={USERNAME}
                            userData={userData}
                            repos={repoResp.data} />,
                        document.getElementById('github-api-data')
                    );

                }
            ).catch((err) => {console.error(err)});
        }
    ).catch( (err) => { console.error(err)});
}

document.addEventListener('DOMContentLoaded', init);
