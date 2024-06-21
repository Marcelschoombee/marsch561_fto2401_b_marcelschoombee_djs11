import React from 'react';
import { Link } from 'react-router-dom';
import genresData from '../genresData';
import '../Header.css'; 

function Header() {
    return (
        <div className="header">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <h2>MyApp</h2>
                </Link>
                <div className="navbar-menu">
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
                    <Link to="/favorites" className="nav-link">Favorites</Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;