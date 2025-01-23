import axios from "axios"
import {CreateUserDto} from "../types/CreateUserDto"


axios.defaults.withCredentials = true;

const instanceForGoogle = axios.create({
    baseURL: 'http://localhost:4000/api/auth',
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
});

const instanceUser = axios.create({
    baseURL: 'http://localhost:4000/user',
});

export const authApi = {
    loginGoogle() {
        window.location.href ="http://localhost:4000/api/auth/google";
        return;
    },

    loginBase(email: string, password: string) {
        return instanceUser.post('/login', { email: email, password: password })
            .then((response) => {
                return response.data;
            })
    },
    register(CreateUserDto: CreateUserDto) {
        return instanceUser.post('/register', {...CreateUserDto}) 
            .then(responce => responce.data)
    },
    logout() {
        return instanceForGoogle.post('/logout')
            .then(responce => responce.data)
    },
    async refreshToken() {
        return instanceForGoogle.get('/refresh')
            .then(responce => responce.data)
    },
    checkAdmin() {
        return instanceForGoogle.get('/checkAdmin')
        .then(responce =>
            {
                return responce.data;
            } ) 
    }

}
