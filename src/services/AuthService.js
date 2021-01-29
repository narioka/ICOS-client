import axios from 'axios';

const API_URL = 'https://icos.tokyo/icos/api/';

class AuthService {

    login(loginInfo) {
        return axios.post(API_URL, loginInfo).then(response => {
            if (response.data.outPutInfo) {
                sessionStorage.setItem("loginUser", JSON.stringify(response.data.outPutInfo))
            }
            return response;
        }).catch(error => {
            sessionStorage.setItem("SE", error);
            throw error;
        });
    }

    logout() {
        sessionStorage.clear();
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('loginUser'));
    }

    getSystemError() {
        return sessionStorage.getItem('SE');
    }
}

export default new AuthService();