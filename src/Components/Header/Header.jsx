// Header.js

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.png";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className={isOpen ? "open" : ""}>
        <div className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <ul className={isOpen ? "open" : ""}> {/* Conditionally render navlinks */}
          <li>
            <NavLink exact to="/" activeClassName="active" className="links">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/Gallery" activeClassName="active" className="links">
              Gallery
            </NavLink>
          </li>
          <li className="user">
            <NavLink to="/SignIn" activeClassName="active" className="links">
              <button className="signIn_btn">
                <FontAwesomeIcon icon={faUser} />
              </button>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
