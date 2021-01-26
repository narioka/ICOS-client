import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import AuthService from '../../services/AuthService'

/**
 * 画面遷移用のcomponent
 */
class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isLogined: false,
            isErrored: false
        }
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        const error = AuthService.getSystemError();
        if (error) {
            this.setState({ loading: false, isLogined: false, isErrored: true });
        } else {
            this.setState({ loading: false, isLogined: user, isErrored: false });
        }
    }

    render() {
        const { component: Component, ...rest } = this.props;
        const { loading, isLogined, isErrored } = this.state;
        if (loading) {
            return <div>Loding</div>
        }
        return (
            <Route {...rest} render={() => {
                return isLogined || isErrored ? <Component {...this.props} /> :
                    <Redirect to={{ pathname: '/icos/login', state: { from: this.props.location } }} />
            }} />
        )
    }
}
export default PrivateRoute;