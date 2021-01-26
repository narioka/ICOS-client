import React from "react";
import { Link } from 'react-router-dom'
import AuthService from '../../services/AuthService';

/**
 * ヘッダーのComponent
 */
class HeaderComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const adminMenuIsOpen = this.props.adminMenuIsOpen;
        const mainMenuIsOpen = this.props.mainMenuIsOpen;
        return (
            <header>
                <h1>iCOS</h1>
                <nav>
                    <ul className="nav-menu">
                        {adminMenuIsOpen &&
                            <li className="nav-menu-item">
                                <input id="acd-check" className="acd-check" type="checkbox" />
                                <label className="acd-label" htmlFor="acd-check">管理者メニュー</label>
                                <div className="acd-content">
                                    <ul>
                                        <li><Link to="/icos/employeeMaster">社員マスタ</Link></li>
                                        <li><Link to="/icos/productMaster">商品マスタ</Link></li>
                                        <li><Link to="/icos/loginHistory">ログイン履歴</Link></li>
                                    </ul>
                                </div>
                            </li>
                        }
                        {mainMenuIsOpen &&
                            <li className="nav-menu-item">
                                <Link to="/icos/menu">メニュー</Link>
                            </li>
                        }
                        {mainMenuIsOpen &&
                            <li className="nav-menu-item">
                                <Link to="/icos/enterLeaving">入出庫管理</Link>
                            </li>
                        }
                        {mainMenuIsOpen &&
                            <li className="nav-menu-item">
                                <Link to="/icos/enterLeavingHitory">入出庫履歴</Link>
                            </li>
                        }
                        {mainMenuIsOpen &&
                            <li className="nav-menu-item">
                                <Link to="/icos/stockSerch">在庫検索</Link>
                            </li>
                        }
                        {mainMenuIsOpen &&
                            <li className="nav-menu-item">
                                <Link to="/icos/inventory">棚卸</Link>
                            </li>
                        }
                        <li className="nav-menu-item">
                            <Link onClick={this.logOut} to="/icos">ログアウト</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }
}
export default HeaderComponent;