import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchShow } from '../api';
import '../App.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [sortBy, setSortBy] = useState('title'); // 'title', 'date'
    const navigate = useNavigate();

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    useEffect(() => {
        const fetchFavoriteShows = async () => {
            setLoading(true);
            try {
                const fetchedFavoriteShows = await Promise.all(
                    favorites.map(async (favorite) => {
                        const [showId, seasonIndex, episodeIndex] = favorite.split('-');
                        const showDetails = await fetchShow(showId);
                        return {
                            ...showDetails,
                            season: showDetails.seasons[seasonIndex],
                            episode: showDetails.seasons[seasonIndex].episodes[episodeIndex],
                            id: showId,
                            seasonIndex,
                            episodeIndex,
                            dateAdded: new Date().toLocaleString()
                        };
                    })
                );
                setFavoriteShows(fetchedFavoriteShows);
            } catch (error) {
                console.error('Error fetching favorite shows:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (favorites.length > 0) {
            fetchFavoriteShows();
        } else {
            setFavoriteShows([]);
            setLoading(false);
        }
    }, [favorites]);

    const removeFavorite = (favoriteId) => {
        const updatedFavorites = favorites.filter(favorite => favorite !== favoriteId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        const updatedFavoriteShows = favoriteShows.filter(show => `${show.id}-${show.seasonIndex}-${show.episodeIndex}` !== favoriteId);
        setFavoriteShows(updatedFavoriteShows);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    // Function to handle sorting based on user selection
    const handleSortOrder = (order) => {
        setSortOrder(order);
    };

    const handleSortBy = (sortBy) => {
        setSortBy(sortBy);
    };

    // Sort favoriteShows
    favoriteShows.sort((a, b) => {
        if (sortBy === 'title') {
            const titleA = a.title.toUpperCase(); // ignore upper and lowercase
            const titleB = b.title.toUpperCase(); // ignore upper and lowercase
            if (sortOrder === 'asc') {
                return titleA.localeCompare(titleB);
            } else {
                return titleB.localeCompare(titleA);
            }
        } else if (sortBy === 'dateAdded') {
            const dateA = new Date(a.dateAdded);
            const dateB = new Date(b.dateAdded);
            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        }
        return 0;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!favorites.length) return <div>No favorite shows added yet.</div>;

    return (
        <div>
            <div className="sort-options">
                <button className={`btn ${sortBy === 'title' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { handleSortBy('title'); handleSortOrder('asc'); }}>A-Z</button>
                <button className={`btn ${sortBy === 'title' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { handleSortBy('title'); handleSortOrder('desc'); }}>Z-A</button>
                <button className={`btn ${sortBy === 'dateAdded' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { handleSortBy('dateAdded'); handleSortOrder('desc'); }}>Newest</button>
                <button className={`btn ${sortBy === 'dateAdded' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { handleSortBy('dateAdded'); handleSortOrder('asc'); }}>Oldest</button>
            </div>

            <button onClick={handleBackClick} className="btn">Back to Home</button>
            <section className="favorites-list">
                {favoriteShows.length > 0 ? (
                    favoriteShows.map((show, index) => (
                        <div key={index} className="favorite-card">
                            <div className="card-image">
                                <img src={show.season.image} alt={show.title} />
                            </div>
                            <div className="card-content">
                                <h2>{show.title} - {show.season.title}</h2>
                                <p><strong>Episode:</strong> {show.episode.title}</p>
                                <p><strong>Description:</strong> {show.episode.description}</p>
                                <p><strong>Date Added:</strong> {show.dateAdded}</p>
                                <audio controls src={show.episode.file}>
                                    Your browser does not support the audio element.
                                </audio>
                                <button className="btn" onClick={() => removeFavorite(`${show.id}-${show.seasonIndex}-${show.episodeIndex}`)}>Remove from Favorites</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no favorite episodes.</p>
                )}
            </section>
        </div>
    );
}

export default Favorites;