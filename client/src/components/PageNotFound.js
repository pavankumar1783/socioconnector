import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

const PageNotFound = props => {
    return (
        <div>
            <p><b><h1 className='large'>Page 404 Not Found</h1></b></p>
            <p>Go Back to <Link to='/dashboard'>Home</Link> </p>
        </div>
    )
}

PageNotFound.propTypes = {

}

export default PageNotFound
