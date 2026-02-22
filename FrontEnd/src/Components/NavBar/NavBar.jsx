import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../Styles/NavBar.css'

function NavBar() {
    return (
        <nav className='navbar'>
            <div className="navbar-brand">
                JanSewa
            </div>
            <div className="navbar-menu">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "navbar-link active" : "navbar-link"
                    }
                    end
                >
                    Home
                </NavLink>
                <NavLink
                    to="/services"
                    className={({ isActive }) =>
                        isActive ? "navbar-link active" : "navbar-link"
                    }
                >
                    Services
                </NavLink>
                <NavLink
                    to="/track"
                    className={({ isActive }) =>
                        isActive ? "navbar-link active" : "navbar-link"
                    }
                >
                    Track Application
                </NavLink>
                <NavLink
                    to="/complaints"
                    className={({ isActive }) =>
                        isActive ? "navbar-link active" : "navbar-link"
                    }
                >
                    Complaints
                </NavLink>
                <NavLink
                    to="/notices"
                    className={({ isActive }) =>
                        isActive ? "navbar-link active" : "navbar-link"
                    }
                >
                    Government Notices
                </NavLink>

                <NavLink>
                    <img className='h-10 rounded-full p-1' src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" alt="" />
                </NavLink>
            </div>
        </nav>
    )
}

export default NavBar