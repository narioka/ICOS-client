import React from 'react';
import AuthService from '../services/AuthService'

/**
 * @classdesc ログイン画面component
 */
export default class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            outPutInfo: [],
            errorInfo: [],
            id: "",
            pass: ""
        }
    }

    changeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    /**
     * 「ログイン」ボタン押下時
     * @param {*} event 
     */
    login = (event) => {
        event.preventDefault();
        let loginInfo = {
            userId: this.state.id,
            password: this.state.pass
        }
        AuthService.login(loginInfo).then(response => {
            if (response.data.errorInfo != null) {
                response.data.errorInfo.forEach(e => {
                    if (e.errorId === "SE*") {
                        this.props.history.push("/icos/error")
                    }
                })
                this.setState({
                    errorInfo: response.data.errorInfo,
                    pass: ""
                });
                return <LoginComponent />
            }
            this.props.history.push("/icos/menu")
        }).catch(() => {
            this.props.history.push("/icos/error")
        });
    }

    render() {
        let msg1;
        let msg2;
        let msg3;
        if (this.state.errorInfo.length) {
            this.state.errorInfo.forEach(e => {
                if (e.errorId === 'PE001') {
                    msg1 = (<div className="error-msg">{e.errorMsg}</div>);
                } else if (e.errorId === 'PE002') {
                    msg2 = (<div className="error-msg">{e.errorMsg}</div>);
                } else {
                    msg3 = (<div className="error-msg">{e.errorMsg}</div>);
                }
            });
        }
        return (
            <section className="wrapper">
                <div className="container">
                    <div className="content" id="login">
                        <div className="heading" id="login">
                            <h1>iCOS</h1>
                        </div>
                        <form onSubmit={this.login} ref={c => {
                            this.form = c;
                        }}>
                            {msg3}
                            <label>ユーザーID</label>
                            <br></br>
                            <input type="text" name="id" value={this.state.id} onChange={this.changeHandler} />
                            <br></br>
                            {msg1}
                            <label>パスワード</label>
                            <br></br>
                            <input type="password" name="pass" value={this.state.pass} onChange={this.changeHandler} />
                            <br></br>
                            {msg2}
                            <button>ログイン</button>
                        </form>
                    </div>
                </div>
            </section>
        );
    }

}