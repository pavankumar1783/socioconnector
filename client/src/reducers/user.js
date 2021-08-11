import foo from './profile'
import  { GET_USERS, GET_USERS_BY_SEARCH, USER_ERROR } from '../actions/types'
const initialState = {
    loading : null,
    users : [],
    loading : true,
    error : {}
}
export default function foo1(state=initialState, action) {
    const { type , payload } = action
    switch (type) {
        case GET_USERS:
            case GET_USERS_BY_SEARCH:
                return {
                    ...state,
                    users: payload,
                    loading: false
                }
            case USER_ERROR: 
                return {
                    ...state,
                    error: payload,
                    loading: false
                } 
            default : return state
    }
}