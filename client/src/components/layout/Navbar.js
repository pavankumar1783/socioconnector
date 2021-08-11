import React, { Fragment } from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

export const Navbar = ({ auth : { isAuthenticated,loading }, logout }) => {
    const authLinks= (
      <div className="navbar2">
        <Link to="/profiles">People</Link>
        <Link to="/posts">Posts</Link>
        <div className="dropdown">
          <button className="dropbtn">My Account
            <i className="fas fa-user"></i>
          </button>
          <div className="dropdown-content">
           <Link to="/edit-profile">Edit Profile</Link>
           <a onClick={logout} href="#!">
             <i className="fas fa-sign-out-alt" />{' '}
             <span className="hide-sm">Logout</span>
           </a>
          </div>
        </div>
      </div>
    )

    const guestLinks= (
      <ul>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    )
    return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'>
          <i className="fas fa-code"></i> SocioConnector
        </Link>
      </h1>
        { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>)}
    </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps,{logout})(Navbar)
