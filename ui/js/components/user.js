import React from 'react';
import PropTypes from 'prop-types';

class User extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'User';
    }

    componentWillMount() {
        this.setState({
            selected: false
        });
    }

    render() {
        let expandedInfo = this.state.selected ? (
            <div className="user-expand col-sm-12">
                This is the expanded user info
            </div>
        ) : undefined;
        return (
            <div
                className="user-root row"
                onClick={()=> {this.props.onClick(this)}}
                data-uuid={this.props.userData}
            >
                <div className="col-sm-6 row-user">
                    {this.props.name}
                </div>
                <div className="col-sm-6 row-icons">
                    <p>Icons go in here</p>

                </div>
                {expandedInfo}
            </div>
        );
    }
}

User.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    userData: PropTypes.object
};
export default User;
