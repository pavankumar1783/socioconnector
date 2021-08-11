import React,{Fragment, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import { getUsers, getUsersByName } from '../../actions/user'

const Profiles = ({ getUsers, getUsersByName, user : {users, loading} }) => {
    useEffect(() => {
        getUsers()
    }, [getUsers])
    
    const [formData,setFormData] = useState({
        name : '',
    })

    const { name } = formData

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = e => {
        e.preventDefault()
        getUsersByName(formData)
    }
    return (
        <Fragment>
            { loading ? (<Spinner />) :(
                <Fragment>
                    <h1 className='large text-primary'>People</h1>
                    <p className='lead'>
                        <i className='fab fa-connectDevelop'></i>
                        Browse and Connect with People
                    </p>
                    <form className="Form" onSubmit={e=> onSubmit(e)}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                name="name" 
                                value={name}
                                onChange={e => onChange(e)}
                                required
                            />
                        </div>
                        <input type="submit" className="btn btn-primary" value="Search" />
                    </form>
                    <div className="profiles">
                        { users.length > 0 ? (
                            users.map(user => (
                                <ProfileItem key={user._id} user={user} />
                            ))
                        ) : (<h4>No Profiles Found</h4>) }
                    </div>
                </Fragment>
                )
            }
        </Fragment>
    )
}

Profiles.propTypes = {
    // getProfiles: PropTypes.func.isRequired,
    // getProfilesByName: PropTypes.func.isRequired,
    getUsers:PropTypes.func.isRequired,
    getUsersByName:PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps,{getUsers, getUsersByName})(Profiles)
