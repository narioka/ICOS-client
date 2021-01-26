import React, { Component } from 'react';
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom';
import HeaderComponent from './common/HeaderComponent';
import AuthService from '../services/AuthService';
import EnterLeavingService from '../services/EnterLeavingService';

/**
 * 入出庫管理画面のcomponent
 */
class EnterLeavingComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            outPutInfo: [],
            errorInfo: [],
            enterLeavingRegistInfoDetail: [],
            itemNumber: "",
            itemNumberError: "半角英数字のみ",
            countNumber: "",
            countNumberError: "1～1000000",
            inoutCategory: "",
            modalIsOpen: false,
            confirmModalFlag: false,
            resultModalFlag: false,
            scanning: false,
            time: ""
        }
    }

    changeHandler = (event) => {
        this.setState({
            outPutInfo: [],
            [event.target.name]: event.target.value,
            itemNumberError: "半角英数字のみ",
            countNumberError: "1～1000000"
        });
    }

    onKeyDown = (event) => {
        let scanning = this.state.scanning;
        if (event.keyCode === 13) {
            if (scanning) {
                this.setState({
                    countNumber: 1,
                    scanning: false
                });
            }
        } else {
            this.setState({ scanning: true });
        }
    }

    addOne = (event) => {
        event.preventDefault();
        let addFlag = true;
        var value = Number(this.state.countNumber)
        if (!/[a-zA-Z0-9]+$/.test(this.state.itemNumber)) {
            addFlag = false; this.setState({
                enterLeavingRegistInfoDetail: [
                    ...this.state.enterLeavingRegistInfoDetail
                ],
                itemNumberError: "半角英数字で入力してください。"
            });
        } else if (value <= 0 || 1000000 < value) {
            addFlag = false;
            this.setState({
                enterLeavingRegistInfoDetail: [
                    ...this.state.enterLeavingRegistInfoDetail
                ],
                countNumberError: value > 1000000 ? "1000000以下で入力してください。" : "1以上で入力してください。"
            });
        } else {
            this.state.enterLeavingRegistInfoDetail.forEach(detail => {
                if (detail.itemNumber === this.state.itemNumber) {
                    detail.countNumber = detail.countNumber + Number(this.state.countNumber);
                    this.setState({
                        enterLeavingRegistInfoDetail: [
                            ...this.state.enterLeavingRegistInfoDetail
                        ],
                        errorInfo: [],
                        itemNumber: "",
                        countNumber: ''
                    });
                    addFlag = false;
                }
            });
        }
        if (addFlag) {
            let commodityInputInfo = {
                itemNumber: this.state.itemNumber,
                countNumber: this.state.countNumber
            }
            EnterLeavingService.getCommodityInfo(commodityInputInfo).then(response => {
                if (response.data.errorInfo != null) {
                    let responseError
                    response.data.errorInfo.forEach(e => {
                        if (e.errorId.indexOf("SE") !== -1) {
                            this.props.history.push("/icos/error")
                        } else if (e.errorId === "PE034") {
                            responseError = { msg: e.errorMsg, itemNumber: this.state.itemNumber };
                        }
                    });
                    this.setState({
                        errorInfo: responseError,
                        itemNumber: ""
                    });
                } else {
                    const commodityMst = response.data.outPutInfo;
                    this.setState(
                        {
                            enterLeavingRegistInfoDetail: [
                                ...this.state.enterLeavingRegistInfoDetail,
                                {
                                    commodityMstId: commodityMst.commodityMstTableId,
                                    itemNumber: commodityMst.itemNumber,
                                    itemName: commodityMst.itemName,
                                    itemMaker: commodityMst.itemMaker,
                                    countNumber: Number(this.state.countNumber),
                                    itemPrice: commodityMst.itemPrice
                                }
                            ],
                            errorInfo: [],
                            itemNumber: "",
                            countNumber: ''
                        });
                }
            }).catch(() => {
                this.props.history.push("/icos/error");
            });
        }
    }

    openModal = (event) => {
        event.preventDefault();
        this.setState({
            inoutCategory: event.target.id,
            modalIsOpen: true,
            confirmModalFlag: true
        });
    }

    closeModal = (event) => {
        event.preventDefault();
        this.setState({
            outPutInfo: [],
            errorInfo: [],
            inoutCategory: "",
            modalIsOpen: false,
            confirmModalFlag: false,
            resultModalFlag: false
        });
    }

    regist = (event) => {
        event.preventDefault();
        let enterLeavingRegistInfo = {
            inOutCategory: this.state.inoutCategory,
            enterLeavingRegistInfoDetail: [
                ...this.state.enterLeavingRegistInfoDetail
            ]
        }
        EnterLeavingService.registEnterLeaving(enterLeavingRegistInfo).then(response => {
            if (response.data.errorInfo != null) {
                response.data.errorInfo.forEach(e => {
                    if (e.errorId.indexOf("SE") !== -1) {
                        sessionStorage.setItem("SE", e);
                        this.props.history.push("/icos/error")
                    }
                });
                this.setState({
                    errorInfo: response.data.errorInfo,
                    inoutCategory: "",
                    confirmModalFlag: false,
                    resultModalFlag: true
                });
            } else {
                this.setState({
                    outPutInfo: response.data.outPutInfo,
                    errorInfo: [],
                    enterLeavingRegistInfoDetail: [],
                    inoutCategory: "",
                    confirmModalFlag: false,
                    resultModalFlag: true
                });
            }
        }).catch(() => {
            this.props.history.push("/icos/error")
        });
    }

    componentDidMount() {
        document.getElementById('itemNumber').focus();
    }

    render() {
        const currentUser = AuthService.getCurrentUser();
        const adminMenuIsOpen = currentUser.adminAuthority === "ADMIN" ? true : false;
        const responseError = this.state.errorInfo
        const resultMessage = this.state.outPutInfo.resultMessage;
        return (
            <div>
                <HeaderComponent adminMenuIsOpen={adminMenuIsOpen} mainMenuIsOpen={true} />
                <section className="inOut-box">
                    <div className="container">
                        <div className="content">
                            <h2>入出庫管理</h2>
                            <form className="add-form" onSubmit={this.addOne} noValidate>
                                <div className="responseError">
                                    {responseError.msg &&
                                        <div>
                                            <span>{responseError.msg}</span>
                                            <span>商品番号：{responseError.itemNumber}</span>
                                        </div>}
                                </div>
                                <dl>
                                    <dt className="required">商品番号</dt>
                                    <dd>
                                        <input id="itemNumber" type="text" name="itemNumber" value={this.state.itemNumber} onChange={this.changeHandler} onKeyDown={this.onKeyDown} pattern="[a-zA-Z0-9]+$" required />
                                        <span className="errorMessage">{this.state.itemNumberError}</span>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="required">数量</dt>
                                    <dd>
                                        <input type="number" name="countNumber" value={this.state.countNumber} onChange={this.changeHandler} min="1" max="1000000" required />
                                        <span className="errorMessage">{this.state.countNumberError}</span>
                                    </dd>
                                </dl>
                                <button>追加</button>
                            </form>
                            <hr />
                            <form className="list-form">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>商品番号</th>
                                            <th>商品名</th>
                                            <th>メーカー</th>
                                            <th>数量</th>
                                            <th>単価</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.enterLeavingRegistInfoDetail.map((data, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.itemNumber}</td>
                                                    <td>{data.itemName}</td>
                                                    <td>{data.itemMaker}</td>
                                                    <td>{data.countNumber}</td>
                                                    <td>{data.itemPrice}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                                <button id="INPUT" onClick={this.openModal}>入庫</button>
                                <button id="OUTPUT" onClick={this.openModal}>出庫</button>
                                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={modalStyle}>
                                    {this.state.confirmModalFlag &&
                                        <div className="confirm-modal">
                                            <p>
                                                {this.state.inoutCategory === "INPUT" ? "入庫しますか？" : "出庫しますか？"}
                                            </p>
                                            <button id="in" onClick={this.regist}>はい</button>
                                            <button id="out" onClick={this.closeModal}>いいえ</button>
                                        </div>
                                    }
                                    {this.state.resultModalFlag &&
                                        <div>
                                            <p>
                                                {resultMessage}
                                                {responseError}
                                            </p>
                                            <button onClick={this.closeModal}>閉じる</button>
                                        </div>
                                    }
                                </Modal>
                            </form>
                        </div>
                    </div>
                </section>
            </div >
        );
    }
}
export default withRouter(EnterLeavingComponent);

Modal.setAppElement('#root');
const modalStyle = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.85)"
    },
    content: {
        position: "absolute",
        width: "auto",
        top: "50%",
        bottom: "auto",
        marginleft: "auto",
        marginright: "auto",
        borderRadius: "10px",
    }
};