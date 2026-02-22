import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import "../../Styles/NavBar.css";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink
          to="/">JanSewa</NavLink>
        </div>
      
      {/* Mobile menu button */}
      <button className="navbar-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Desktop menu */}
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
          to="/track-Application"
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
          to="/government-notice"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Government Notices
        </NavLink>

        <NavLink>
          <img
            className="h-10 rounded-full p-1"
            src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
            alt=""
          />
        </NavLink>
      </div>

      {/* Mobile menu */}
      <div className={`navbar-mobile ${isMenuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          end
          onClick={closeMenu}
        >
          Home
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          Services
        </NavLink>
        <NavLink
          to="/track-Application"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          Track Application
        </NavLink>
        <NavLink
          to="/complaints"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          Complaints
        </NavLink>
        <NavLink
          to="/government-notice"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          Government Notices
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
