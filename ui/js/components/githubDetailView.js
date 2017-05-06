import React from 'react';
import PropTypes from 'prop-types';

class GithubDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ApplicantsPage';
    }

    render() {
        let userData = this.props.userData;
        return (
            <div>
                <div>
                    <h2>{userData.fullname || this.props.username}</h2>
                    <a className="" href={userData.html_url}>{`@${userData.login}`}</a>
                    <p>Followers: <span>{userData.followers}</span></p>
                    <p>Repositories: <span>{userData.public_repos}</span></p>
                    <img src={userData.avatar_url} />
                    <br />
                    {this.props.repos.map( (item, idx) => {
                        return (
                            <p key={idx}>
                                <a href={item.html_url}>{item.name}</a>
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    }


}

GithubDetailView.propTypes = {
    username: PropTypes.string.isRequired,
    userData: PropTypes.object.isRequired,
    repos: PropTypes.array.isRequired
};

export default GithubDetailView;
