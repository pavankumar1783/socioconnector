import axios from 'axios'
import { setAlert } from './alert'
import {
    GET_USERS, GET_USERS_BY_SEARCH, USER_ERROR
} from './types'


export const getUsers = () => async dispatch => {
    try {
        const res = await axios.get('/api/users')
        dispatch({
            type : GET_USERS,
            payload : res.data
        })
    } catch (e) {
        dispatch({
            type: USER_ERROR,
            payload: { msg : e.response.statusText, status: e.response.status}
        })
    }
}

export const getUsersByName = (formData) => async dispatch => {
    const { name } = formData
    try {
        const res = await axios.get(`/api/users/${name}`)
        dispatch({
            type : GET_USERS_BY_SEARCH,
            payload : res.data
        })
    } catch (e) {
        dispatch({
            type: USER_ERROR,
            payload: { msg : e.response.statusText, status: e.response.status}
        })
    }
}