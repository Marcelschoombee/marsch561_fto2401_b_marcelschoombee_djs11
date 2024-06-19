import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchShow } from '../api';
import '../App.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [sortOrder, setSortOrder] = useState('recent'); // 'recent', 'oldest', 'asc', 'desc'
    const navigate = useNavigate();

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    useEffect(() => {
        const fetchFavoriteShows = async () => {
            try {
                const shows = await Promise.all(
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

                // Sort shows based on sort order
                let sortedShows = [...shows];
                if (sortOrder === 'recent') {
                    sortedShows.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Most recent first
                } else if (sortOrder === 'oldest') {
                    sortedShows.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)); // Furthest back first
                } else if (sortOrder === 'asc') {
                    sortedShows.sort((a, b) => {
                        const titleA = a.title.toUpperCase(); // ignore upper and lowercase
                        const titleB = b.title.toUpperCase(); // ignore upper and lowercase
                        if (titleA < titleB) return -1;
                        if (titleA > titleB) return 1;
                        return 0;
                    });
                } else if (sortOrder === 'desc') {
                    sortedShows.sort((a, b) => {
                        const titleA = a.title.toUpperCase(); // ignore upper and lowercase
                        const titleB = b.title.toUpperCase(); // ignore upper and lowercase
                        if (titleA > titleB) return -1;
                        if (titleA < titleB) return 1;
                        return 0;
                    });
                }

                // Set sorted shows to state
                setFavoriteShows(sortedShows);
            } catch (error) {
                console.error('Error fetching favorite shows:', error);
            }
        };

        if (favorites.length > 0) {
            fetchFavoriteShows();
        } else {
            setFavoriteShows([]); // Reset favoriteShows if no favorites are present
        }
    }, [favorites, sortOrder]);

    const removeFavorite = (favoriteId) => {
        console.log(`Removing favorite: ${favoriteId}`);

        const updatedFavorites = favorites.filter(favorite => favorite !== favoriteId);
        console.log('Updated favorites:', updatedFavorites);

        setFavorites(updatedFavorites);

        // Update localStorage after updating state
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        console.log('LocalStorage updated:', localStorage.getItem('favorites'));

        // Update favoriteShows state to reflect removal visually
        const updatedFavoriteShows = favoriteShows.filter(show => `${show.id}-${show.season.index}-${show.episode.index}` !== favoriteId);
        setFavoriteShows(updatedFavoriteShows);
    };

    const goToHomePage = () => {
        navigate('/');
    };

    // Function to handle sorting based on user selection
    const handleSortOrder = (order) => {
        setSortOrder(order);
    };

    return (
        <section className="favorites-list">
            <button className="btn" onClick={goToHomePage}>Go to Home</button>
            <h1>My Favorite Episodes - {sortOrder === 'recent' ? 'Most Recently Updated' : sortOrder === 'oldest' ? 'Furthest Back Updated' : sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</h1>
            <div className="sort-options">
                <button className={`btn ${sortOrder === 'recent' ? 'active' : ''}`} onClick={() => handleSortOrder('recent')}>Most Recently Updated</button>
                <button className={`btn ${sortOrder === 'oldest' ? 'active' : ''}`} onClick={() => handleSortOrder('oldest')}>Furthest Back Updated</button>
                <button className={`btn ${sortOrder === 'asc' ? 'active' : ''}`} onClick={() => handleSortOrder('asc')}>A-Z</button>
                <button className={`btn ${sortOrder === 'desc' ? 'active' : ''}`} onClick={() => handleSortOrder('desc')}>Z-A</button>
            </div>
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
                            <button className="btn" onClick={() => removeFavorite(`${show.id}-${show.season.index}-${show.episode.index}`)}>Remove from Favorites</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>You have no favorite episodes.</p>
            )}
        </section>
    );
}

export default Favorites;