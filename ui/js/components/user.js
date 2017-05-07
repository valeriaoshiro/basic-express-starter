import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
        return (
            <div className="applicantlist-box rounded">
            <div
                className="user-root row"
                onClick={()=> {this.props.onClick(this)}}
                data-uuid={this.props.userData}
            >
                <div className="d-flex justify-content-end align-items-center">
                    <div className="mr-auto p-2">
                    {this.props.name}
                    </div>
                    <div className="icons d-flex justify-content-end">
                        <a href="#"><i className="fa fa-github fa-3x" aria-hidden="true"></i></a>
                    </div>
                </div>  
                {expandedInfo}
                </div>  
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
