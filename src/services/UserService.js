import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8080/users";

class UserService {

    getUsers(){
        console.log("getUsers");
        return axios.get(USER_API_BASE_URL);
    }

    createUser(user){
        console.log("createUser");
        return axios.post(USER_API_BASE_URL, user);
    }

    getUserById(userId){
        console.log("getUserById: " + userId);
        return axios.get(USER_API_BASE_URL + '/_id/' + userId);
    }

    updateUser(user, userId){
        console.log("updateUser");
        return axios.put(USER_API_BASE_URL + '/' + userId, user);
    }

    deleteUser(userId){
        console.log("deleteUser");
        return axios.delete(USER_API_BASE_URL + '/' + userId);
    }
}

export default new UserService()