import axios from 'axios'
import { setAlert } from './alert'
import {
    GET_PROFILE,
    UPDATE_PROFILE,
    GET_REPOS,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    PROFILE_ERROR
} from './types'

//Get Current Users Profile
export const getCurrentUserProfile = () => async dispatch => {
    try {
        const res= await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (e) {
        console.log(e)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

//Get Profile by Id
export const getProfileById = (userId) => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    try {
        const res= await axios.get(`/api/profile/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (e) {
        console.log(e)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}
                                                                                                                                                                                                                                                                                                      

//Get Github repos
export const getGithubRepos = (username) => async dispatch => {
    try {
        const res= await axios.get(`/api/profile/github/${username}`)

        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (e) {
        console.log(e)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}


//create ofr update profile
export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {
        const config= {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res= await axios.post('/api/profile', formData, config )
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created','success' ) )
        if(!edit){
            history.push('/dashboard')
        }
    } catch (e) {
        const errors= e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

// Add Experience
export const addExperience = (formData,history) => async dispatch => {
    try {
        const config= {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res= await axios.put('/api/profile/experience', formData, config )
        console.log(res)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data.profile
        })
        dispatch( setAlert('Experience Added','success') )
        history.push('/dashboard')
    } catch (e) {
        console.log(e)
        const errors= e.res.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

// Add Education
export const addEducation = (formData,history) => async dispatch => {
    try {
        const config= {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res= await axios.put('/api/profile/education', formData, config )
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data.profile
        })
        dispatch( setAlert('Education Created','success') )
        history.push('/dashboard')
    } catch (e) {
        const errors= e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

//Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch( setAlert('Experience removed','success') )
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: e.response.statusText, status: e.response.status }
        })
    }
}

//Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch( setAlert('Education removed','success') )
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: e.response.statusText, status: e.response.status }
        })
    }
}

//Delete Account and Profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you Sure? This can NOT be UNDONE!')){
        try {
            await axios.delete(`/api/profile`)
            dispatch({type: CLEAR_PROFILE})
            dispatch({type: ACCOUNT_DELETED})
            dispatch( setAlert('Your Account has been permanently deleted') )
        } catch (e) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: e.response.statusText, status: e.response.status }
            })
        }
    }
}

