import React from 'react';
import { Link } from 'react-router-dom';
import genresData from '../genresData';
import '../index.css';

function Header({ toggleMenu }) {
    return (
        <div className="header--div">
            <nav className="nav-bar">
                <button className="hamburger-menu" onClick={toggleMenu}>
                    &#9776;
                </button>
                <h2>Header</h2>
                <div className="dropdown">
                    <button className="dropbtn">Genres</button>
                    <div className="dropdown-content">
                        <Link to="/" className="genre-item">Show All</Link>
                        {genresData.map(item => (
                            <Link key={item.id} to={`/genres/${item.id}`} className="genre-item">
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <Link to="/favorites" className="dropbtn">Favorites</Link>
            </nav>
        </div>
    );
}

export default Header;