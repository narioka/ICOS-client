import axios from 'axios';

const API_URL = 'https://Icos-env.eba-d3wy2bpd.ap-northeast-1.elasticbeanstalk.com/icos/api/enterLeaving/';

class EnterLeavingService {

    getCommodityInfo(commodityInputInfo) {
        return axios.post(API_URL + "get", commodityInputInfo).then(response => {
            return response;
        }).catch(error => {
            throw this.throwError(error);
        });
    }

    registEnterLeaving(enterLeavingRegistInfo) {
        return axios.post(API_URL + "regist", enterLeavingRegistInfo).then(response => {
            return response;
        }).catch(error => {
            throw this.throwError(error);
        });
    }

    throwError(error) {
        sessionStorage.setItem("SE", error);
        return error;
    }

}

export default new EnterLeavingService();

