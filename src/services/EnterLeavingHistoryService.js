import axios from 'axios';

const SAMPLE_API_URL = 'http://localhost:5000/icos/api/menu/history/';

/**
 * 入出庫履歴情報編集および入出庫履歴帳票出力のサービス
 * 
 */
class EnterLeavingHistoryService {
    
    /**
     * サーバー機能の入出庫履歴情報取得処理を実行する
     * 
     * @param {*} conditions 
     */
    search(conditions) {
        return axios.post(SAMPLE_API_URL + 'search', conditions);
    }

    /**
     * サーバー機能の入出庫履歴情報更新処理を実行する
     * 
     * @param {*} conditions 
     * @param {*} crudType 
     */
    update(conditions, crudType) {
        return axios.post(SAMPLE_API_URL + 'edit/' + crudType, conditions);
    }

    /**
     * サーバー機能の入出庫履歴帳票出力処理を実行する
     * 
     * @param {*} view 
     */
    exportPDF(view) {
        return axios.post(SAMPLE_API_URL + 'exportPdf/', view, { responseType: 'blob' });
    }
}

export default new EnterLeavingHistoryService();