import React from 'react';
import { Link } from 'react-router-dom';
import genresData from '../genre'; // Adjust the path based on your project structure
import '../index.css';

function Header() {
    return (
        <div className="header--div">
            <nav className="nav-bar">
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
            </nav>
        </div>
    );
}

export default Header;