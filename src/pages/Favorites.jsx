import React, { useEffect, useState, useContext, useCallback } from 'react';
import { SortingContext } from '../utils/SortingContext';
import { fetchShow } from '../api';
import '../App.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { sortOrder, sortBy } = useContext(SortingContext);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const sortData = useCallback((data) => {
        return data.sort((a, b) => {
            if (sortBy === 'title') {
                const titleA = a.title.toUpperCase();
                const titleB = b.title.toUpperCase();
                return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
            } else if (sortBy === 'updated') {
                return sortOrder === 'asc' ? new Date(b.updated) - new Date(a.updated) : new Date(a.updated) - new Date(b.updated);
            }
            return 0;
        });
    }, [sortOrder, sortBy]);

    useEffect(() => {
        const fetchFavoriteShows = async () => {
            setLoading(true);
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

                const sortedShows = sortData(shows);
                setFavoriteShows(sortedShows);
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
    }, [favorites, sortOrder, sortBy, sortData]);

    const removeFavorite = (favoriteId) => {
        const updatedFavorites = favorites.filter(favorite => favorite !== favoriteId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        const updatedFavoriteShows = favoriteShows.filter(show => `${show.id}-${show.seasonIndex}-${show.episodeIndex}` !== favoriteId);
        setFavoriteShows(updatedFavoriteShows);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!favorites.length) return <div>No favorite shows added yet.</div>;

    return (
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
    );
}

export default Favorites;