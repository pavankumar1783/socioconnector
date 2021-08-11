import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProfileItem = ( {
        user: { _id, name, avatar }
}) => {
    return (
        <div className='profile bg-light'>
            <img src={avatar} alt='' className='round-img' />
            <div>
                <h2>{name}</h2>
                <Link to={`/profile/${_id}`} className='btn btn-primary'>View Profile</Link>
            </div>
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileItem
