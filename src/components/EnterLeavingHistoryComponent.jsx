import React from 'react';
import Modal from 'react-modal';
import HeaderComponent from './common/HeaderComponent';
import AuthService from '../services/AuthService';
import EnterLeavingHistoryService from '../services/EnterLeavingHistoryService';
import { withRouter } from 'react-router-dom';

/**
 * 入出庫履歴情報編集および入出庫履歴帳票出力のコンポーネント
 * 
 */
class EnterLeavingHistoryComponent extends React.Component {

    /**
     * EnterLeavingHistoryComponentの初期設定
     * @param {*} props 
     */
    constructor(props) {
        super(props)
        this.state = {
            searchConditions: {
                itemNumber: '',
                itemName: '',
                inOutCategory: '',
                startDate: '',
                endDate: '',
                registUser: ''
            },
            modalInfo: {
                itemNumber: '',
                itemName: '',
                inOutCategory: '',
                inOutNumber: '',
                inoutHistoryInfoTableId: ''
            },
            searchInfo: [],
            errorInfo: [],
            modalErrorInfo: [],
            modalIsOpen: false,
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        let printBtn = document.getElementById('print');
        printBtn.disabled = true;
    }

    /**
     * 検索条件の変更イベント
     * 
     * @param {*} event 
     */
    changeSearchConditionHandler = (event) => {
        const copy = this.state.searchConditions;
        copy[event.target.name] = event.target.value;
        this.setState({ searchConditions: copy });
    }

    /**
     * 更新情報の変更イベント
     * 
     * @param {*} event 
     */
    changeEditConditionHandler = (event) => {
        const copy = this.state.modalInfo;
        copy[event.target.name] = event.target.value;
        this.setState({ modalInfo: copy });
    }

    /**
     * 検索ボタン押下時のイベント
     * 
     * @param {*} event 
     */
    search = (event) => {
        event.preventDefault();
        EnterLeavingHistoryService.search(this.state.searchConditions).then(response => {
            const data = response.data;
            if (data.outPutInfo != null) {
                this.setState({ searchInfo: data.outPutInfo.enterLeavingSearchResultInfoDetail });
            } else {
                this.setState({ searchResult: [] });
            }

            if (data.errorInfo != null) {
                data.errorInfo.forEach(e => {
                    if (e.errorId.indexOf("SE") !== -1) {
                        sessionStorage.setItem("SE", e);
                        this.props.history.push("/icos/error")
                    }
                });
                this.setState({ errorInfo: data.errorInfo });
            } else {
                this.setState({ errorInfo: [] });
            }

            let printBtn = document.getElementById('print');
            if (this.state.searchInfo.length === 0) {
                printBtn.disabled = true;
            } else {
                printBtn.disabled = false;
            }
        }).catch(() => {
            this.props.history.push("/icos/error");
        });
    }

    /**
     * クリアボタン押下時のイベント
     * 
     * @param {*} event 
     */
    clear = (event) => {
        event.preventDefault();
        this.setState({
            searchConditions: {
                itemNumber: '',
                itemName: '',
                inOutCategory: '',
                startDate: '',
                endDate: '',
                registUser: ''
            },
            searchInfo: [],
            errorInfo: []
        });
        let printBtn = document.getElementById('print');
        printBtn.disabled = true;
    }

    /**
     * 印刷ボタン押下時のイベント
     * 
     * @param {*} event 
     */
    print = (event) => {
        event.preventDefault();

        let table = document.getElementById('data-list');
        let view = [];

        for (let row of table.rows) {
            let cells = row.cells;

            let printInfo = {
                itemNumber: '',
                itemName: '',
                inOutCategory: '',
                inOutNumber: '',
                registDate: '',
                registUser: '',
                updateDate: '',
                updateUser: ''
            };

            Object.keys(printInfo).map((key, index) => {
                return printInfo[key] = cells[index + 1].innerText;
            });
            view.push(printInfo);
        }

        view.shift();
        let request = { enterLeavingHistoryInputInfoDetail: view };
        EnterLeavingHistoryService.exportPDF(request).then(response => {
            const file = new Blob(
                [response.data], { type: 'application/pdf' }
            );
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }).catch(() => {
            this.props.history.push("/icos/error");
        });
    }

    /**
     * モーダルウィンドウのオープンイベント（編集ボタン押下時）
     * 
     * @param {*} id 
     */
    openModal = id => () => {
        const target = this.state.searchInfo.filter(info => {
            return info.inoutHistoryInfoTableId === id;
        })[0];
        let inOutCategory;
        if (target.inOutCategory === '出庫') {
            inOutCategory = 'OUTPUT';
        } else {
            inOutCategory = 'INPUT';
        }

        const copyModalInfo = this.state.modalInfo;
        copyModalInfo['itemName'] = target.itemName;
        copyModalInfo['itemNumber'] = target.itemNumber;
        copyModalInfo['inOutCategory'] = inOutCategory;
        copyModalInfo['inOutNumber'] = target.inOutNumber;
        copyModalInfo['inoutHistoryInfoTableId'] = target.inoutHistoryInfoTableId;
        this.setState({ modalInfo: copyModalInfo, modalIsOpen: true });
    }

    /**
     * モーダルウィンドウのクローズイベント（ウィンドウ外クリック時）
     * 
     */
    closeModal() {
        this.setState({ modalIsOpen: false, modalErrorInfo: [] });
    }

    /**
     * 更新ボタン押下時のイベント
     * 
     * @param {*} event 
     */
    edit = (event) => {

        if (!window.confirm("更新を行います。よろしいですか？")) {
            alert("更新をキャンセルしました。");
            return;
        }

        event.preventDefault();
        let editConditions = {
            enterLeavingHistoryInfoId: this.state.modalInfo.inoutHistoryInfoTableId,
            inOutCategory: this.state.modalInfo.inOutCategory,
            inOutNumber: this.state.modalInfo.inOutNumber
        };

        EnterLeavingHistoryService.update(editConditions, 'update').then(response => {
            const data = response.data;

            if (data.errorInfo != null) {
                data.errorInfo.forEach(e => {
                    if (e.errorId.indexOf("SE") !== -1) {
                        sessionStorage.setItem("SE", e);
                        this.props.history.push("/icos/error")
                    }
                });
                this.setState({ modalErrorInfo: data.errorInfo });
                return;
            } else {
                this.setState({ modalErrorInfo: [] });
                alert(data.outPutInfo.resultMessage);
            }

            EnterLeavingHistoryService.search(this.state.searchConditions).then(response => {
                const data = response.data;
                if (data.outPutInfo != null) {
                    this.setState({ searchInfo: data.outPutInfo.enterLeavingSearchResultInfoDetail });
                } else {
                    this.setState({ searchResult: [] });
                }
            });
            this.closeModal();

        }).catch(() => {
            this.props.history.push("/icos/error");
        });
    }

    /**
     * 削除ボタン押下時のイベント
     * 
     * @param {*} event 
     */
    delete = (event) => {

        if (!window.confirm("削除を行います。よろしいですか？")) {
            alert("削除をキャンセルしました。");
            return;
        }

        event.preventDefault();
        let editConditions = {
            enterLeavingHistoryInfoId: this.state.modalInfo.inoutHistoryInfoTableId,
            inOutCategory: this.state.modalInfo.inOutCategory,
            inOutNumber: this.state.modalInfo.inOutNumber
        };

        EnterLeavingHistoryService.update(editConditions, 'delete').then(response => {
            const data = response.data;

            if (data.errorInfo != null) {
                data.errorInfo.forEach(e => {
                    if (e.errorId.indexOf("SE") !== -1) {
                        sessionStorage.setItem("SE", e);
                        this.props.history.push("/icos/error")
                    }
                });
                this.setState({ modalErrorInfo: data.errorInfo });
                return;
            } else {
                this.setState({ modalErrorInfo: [] });
                alert(data.outPutInfo.resultMessage);
            }

            EnterLeavingHistoryService.search(this.state.searchConditions).then(response => {
                const data = response.data;
                if (data.outPutInfo != null) {
                    this.setState({ searchInfo: data.outPutInfo.enterLeavingSearchResultInfoDetail });
                } else {
                    this.setState({ searchResult: [] });
                }
            });
            this.closeModal();

        }).catch(() => {
            this.props.history.push("/icos/error");
        });
    }

    /**
     * 画面のレンダリング処理
     * 
     */
    render() {
        const currentUser = AuthService.getCurrentUser();
        const adminMenuIsOpen = currentUser.adminAuthority === "ADMIN" ? true : false;
        return (
            <div>
                <HeaderComponent adminMenuIsOpen={adminMenuIsOpen} mainMenuIsOpen={true} />
                <section className="inOut-box">
                    <div className="container">
                        <div className="content">
                            <h2>入出庫履歴</h2>
                            {/* 検索条件テーブル */}
                            <form className="add-form">
                                <table id="input-table">
                                    <thead>
                                        <tr>
                                            <th colSpan="6">検索条件</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>商品番号</td>
                                            <td><input type="text" name="itemNumber" value={this.state.searchConditions.itemNumber} onChange={this.changeSearchConditionHandler} /></td>
                                            <td>品名</td>
                                            <td><input type="text" name="itemName" value={this.state.searchConditions.itemName} onChange={this.changeSearchConditionHandler} /></td>
                                            <td>区分</td>
                                            <td>
                                                <select name="inOutCategory" value={this.state.searchConditions.inOutCategory} onChange={this.changeSearchConditionHandler}>
                                                    <option value="">-</option>
                                                    <option value="INPUT">入庫</option>
                                                    <option value="OUTPUT">出庫</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>日付</td>
                                            <td>
                                                <input type="datetime-local" name="startDate" value={this.state.searchConditions.startDate} onChange={this.changeSearchConditionHandler} />
                                    ～
                                    <input type="datetime-local" name="endDate" value={this.state.searchConditions.endDate} onChange={this.changeSearchConditionHandler} />
                                            </td>
                                            <td>登録者</td>
                                            <td colSpan="3"><input type="text" name="registUser" value={this.state.searchConditions.registUser} onChange={this.changeSearchConditionHandler} /></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6">
                                                <button id="history-search" onClick={this.search}>履歴検索</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* エラーメッセージ表示領域 */}
                                <div className="responseError">
                                    {this.state.errorInfo.map((error, index) =>
                                        <div><span key={index}>{error.errorId + '：' + error.errorMsg}</span></div>
                                    )}
                                </div>
                            </form>
                            {/* 検索結果テーブル */}
                            <form className="list-form">
                                <table id="data-list">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>商品番号</th>
                                            <th>品名</th>
                                            <th>区分</th>
                                            <th>入出庫数</th>
                                            <th>登録日</th>
                                            <th>登録者</th>
                                            <th>更新日</th>
                                            <th>更新者</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.searchInfo.map((result, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                {Object.values(result).map(function (data, index) {
                                                    if (index === 0) {
                                                        // IDの表示はスキップ
                                                        return null;
                                                    }
                                                    return <td key={index}>{data}</td>;
                                                })}
                                                <td>
                                                    <div className="edit-btn">
                                                        <button type="button" onClick={this.openModal(result.inoutHistoryInfoTableId)}>編集</button>
                                                    </div>
                                                </td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                                <div className="list-bottom-btn">
                                    <button type="button" id="print" onClick={this.print}>印刷</button>
                                    <button type="button" onClick={this.clear}>クリア</button>
                                </div>
                            </form>
                            <Modal
                                isOpen={this.state.modalIsOpen}
                                onRequestClose={this.closeModal}
                                style={customStyles}>
                                <form className="list-form">
                                    <h2>入出庫履歴修正</h2>
                                    {/* エラーメッセージ表示領域 */}
                                    <div className="responseError">
                                        {this.state.modalErrorInfo.map((error, index) =>
                                            <div><span key={index}>{error.errorId + '：' + error.errorMsg}</span></div>
                                        )}
                                    </div>
                                    <table id="data-list">
                                        <thead>
                                            <tr>
                                                <th>商品番号</th>
                                                <th>品名</th>
                                                <th>区分</th>
                                                <th>入出庫数</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{this.state.modalInfo.itemNumber}</td>
                                                <td>{this.state.modalInfo.itemName}</td>
                                                <td>
                                                    <input type="radio" id="in" name="inOutCategory" value="INPUT" defaultChecked={this.state.modalInfo.inOutCategory === 'INPUT'} onChange={this.changeEditConditionHandler} />
                                                    <label htmlFor="in">入庫</label>
                                                    <input type="radio" id="out" name="inOutCategory" value="OUTPUT" defaultChecked={this.state.modalInfo.inOutCategory === 'OUTPUT'} onChange={this.changeEditConditionHandler} />
                                                    <label htmlFor="out">出庫</label>
                                                </td>
                                                <td><input type='text' size="3" name="inOutNumber" defaultValue={this.state.modalInfo.inOutNumber} onChange={this.changeEditConditionHandler} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="editFinish-btn">
                                        <input type="hidden" name="enterLeavingHistoryInfoId" value={this.state.modalInfo.inoutHistoryInfoTableId} />
                                        <button id="edit-ok-btn" type="button" onClick={this.edit}>変更</button>
                                        <button id="delete-btn" type="button" onClick={this.delete}>削除</button>
                                    </div>
                                </form>
                            </Modal>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

/**
 * モーダルウインドウのスタイル定義
 * 
 */
const customStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.85)"
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        padding: '20px',
        textAlign: 'center',
    }
};
Modal.setAppElement('body')

export default withRouter(EnterLeavingHistoryComponent);