import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/";

class Service {

    get(name){
        console.log("get " + name);
        return axios.get(API_BASE_URL + name);
    }

    createUser(user){
        console.log("createUser");
        return axios.post(API_BASE_URL, user);
    }

    getUserById(userId){
        console.log("getUserById: " + userId);
        return axios.get(API_BASE_URL + '_id/' + userId);
    }

    updateUser(user, userId){
        console.log("updateUser");
        return axios.put(API_BASE_URL  + userId, user);
    }

    deleteUser(userId){
        console.log("deleteUser");
        return axios.delete(API_BASE_URL + '/' + userId);
    }
}

export default new Service()