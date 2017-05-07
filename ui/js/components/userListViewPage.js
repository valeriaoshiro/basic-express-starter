import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'sort-by';

import User from './user';

class UserListViewPage extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'UserListViewPage';

        this.onUserClick = this.onUserClick.bind(this);
    }
    componentWillMount() {
        this.setState({
            sort: 'name'
        });
    }

    onUserClick(userComponent) {
        userComponent.setState({
            selected: !userComponent.state.selected
        });
    }

    render() {
        let users = this.props.users.sort(sortBy(this.state.sort));
        return (
            <div className="clearfix">
                {users.map( (user, idx) => {
                    return (
                        <User
                            key={idx}
                            onClick={this.onUserClick}
                            {...user}
                        />
                    );
                })}
            </div>
        );
    }
}

UserListViewPage.propTypes = {
    users: PropTypes.array.isRequired
}
export default UserListViewPage;
