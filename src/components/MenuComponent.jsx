import React from 'react';
import HeaderComponent from './common/HeaderComponent';
import AuthService from '../services/AuthService';
import enterLeavingImg from '../images/enterLeaving.png';
import enterLeavingHistoryImg from '../images/enterLeavingHistory.png';
import stockSearchImg from '../images/stockSearch.png';
import inventoryImg from '../images/inventory.png'

/**
 * メニュー画面のComponent
 */
export default class MenuComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const currentUser = AuthService.getCurrentUser();
        const adminMenuIsOpen = currentUser.adminAuthority === "ADMIN" ? true : false;
        return (
            <div>
                <HeaderComponent adminMenuIsOpen={adminMenuIsOpen} mainMenuIsOpen={false} />
                <div className="wrapper">
                    <div className="container">
                        <div className="content">
                            <h2 className="heading">MENU</h2>
                            <div className="list">
                                <div className="list-item">
                                    <a href="enterLeaving">
                                        <img src={enterLeavingImg} className="image" alt="入出庫管理" />
                                        <div className="text">入出庫管理</div>
                                    </a>
                                </div>
                                <div className="list-item">
                                    <a href="enterLeavingHistory">
                                        <img src={enterLeavingHistoryImg} className="image" alt="入出庫履歴" />
                                        <div className="text">入出庫履歴</div>
                                    </a>
                                </div>
                                <div className="list-item">
                                    <a href="stockSearch">
                                        <img src={stockSearchImg} className="image" alt="在庫検索" />
                                        <div className="text">在庫検索</div>
                                    </a>
                                </div>
                                <div className="list-item">
                                    <a href="inventoryCollection">
                                        <img src={inventoryImg} className="image" alt="棚卸" />
                                        <div className="text">棚卸</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}