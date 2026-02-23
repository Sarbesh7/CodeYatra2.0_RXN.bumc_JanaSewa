import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import "../../Styles/NavBar.css";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const { t, toggleLanguage } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const closeProfileMenu = () => setIsProfileMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink
          to="/">{t.brand}</NavLink>
      </div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <div className="navbar-menu">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          end
        >
          {t.home}
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          {t.services}
        </NavLink>
        <NavLink
          to="/track-Application"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          {t.trackApplication}
        </NavLink>
        <NavLink
          to="/complaints"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          {t.complaints}
        </NavLink>
        <NavLink
          to="/government-notice"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          {t.governmentNotices}
        </NavLink>

        <div className="navbar-profile" ref={profileMenuRef}>
          <img
            className="profile-avatar"
            src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
            alt="Profile"
            onClick={toggleProfileMenu}
          />
          {isProfileMenuOpen && (
            <div className="profile-dropdown">
              {isAuthenticated && isAdmin() && (
                <div
                  className="profile-dropdown-item"
                  onClick={() => {
                    navigate("/admin/dashboard");
                    closeProfileMenu();
                  }}
                >
                  {t.adminDashboard}
                </div>
              )}
              {isAuthenticated && (
                <div
                  className="profile-dropdown-item"
                  onClick={() => {
                    navigate("/profile/personal-details");
                    closeProfileMenu();
                  }}
                >
                  {t.personalDetails}
                </div>
              )}
              <div
                className="profile-dropdown-item"
                onClick={() => {
                  navigate("/contact-us");
                  closeProfileMenu();
                }}
              >
                {t.contactUs}
              </div>
              <div
                className="profile-dropdown-item"
                onClick={() => {
                  toggleLanguage();
                  closeProfileMenu();
                }}
              >
                {t.switchLanguage}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`navbar-mobile ${isMenuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          end
          onClick={closeMenu}
        >
          {t.home}
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          {t.services}
        </NavLink>
        <NavLink
          to="/track-Application"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          {t.trackApplication}
        </NavLink>
        <NavLink
          to="/complaints"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          {t.complaints}
        </NavLink>
        <NavLink
          to="/government-notice"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={closeMenu}
        >
          {t.governmentNotices}
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
