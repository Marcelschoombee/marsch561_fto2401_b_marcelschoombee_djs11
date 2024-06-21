import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import genresData from '../genresData';
import '../Header.css'; 

function Header() {

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // Use useNavigate to get the navigation function

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`); // Use navigate instead of history.push
        }
    };

    return (
        <div className="header">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                <img src="../images/PodPlayer.png" alt="PodPlayer Logo" className='pod-image' />
                    <h2>PodPlayer</h2>
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
                    <Link to="/favorites" className="favoritesbtn">Favorites</Link>
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                            placeholder="Search shows..."
                        />
                        <button type="submit" className="dropbtn">
                            Search
                        </button>
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default Header;