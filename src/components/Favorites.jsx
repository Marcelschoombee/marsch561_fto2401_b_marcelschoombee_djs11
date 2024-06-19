import React, { useEffect, useState } from 'react';
import { fetchShow } from '../api';
import '../App.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                            episode: showDetails.seasons[seasonIndex].episodes[episodeIndex]
                        };
                    })
                );
                setFavoriteShows(shows);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (favorites.length > 0) {
            fetchFavoriteShows();
        } else {
            setLoading(false);
        }
    }, [favorites]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="favorites-list">
            <h1>My Favorite Episodes</h1>
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
                            <audio controls src={show.episode.file}>
                                Your browser does not support the audio element.
                            </audio>
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