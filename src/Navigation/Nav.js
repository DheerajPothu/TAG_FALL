import { FiHeart } from "react-icons/fi";


import "./Nav.css";

const Nav = ({ handleInputChange, query }) => {
  return (
    <nav>
      <div className="nav-container">
        <input
          className="search-input"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Type to search"
        />
      </div>
      <div className="profile-container">
        <a href="#">
          <FiHeart className="nav-icons" />
        </a>

      </div>
    </nav>
  );
};

export default Nav;