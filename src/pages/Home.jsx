import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPreview, fetchShow } from '../api';
import genresData from '../genresData';
import '../App.css';

function Home() {
    const { id } = useParams();
    const selectedGenre = id ? parseInt(id) : null;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    

    // Modal state
    const [selectedShow, setSelectedShow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0); // State to track current season index
    const [currentEpisode, setCurrentEpisode] = useState(null); // State to track current episode
    const [favorites, setFavorites] = useState([]); // State to track favorite episodes
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const previewData = await fetchPreview();
                setData(previewData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const filterByGenre = (items, genreId) => {
        if (!genreId) return items;
        return items.filter(item => item.genres.includes(genreId));
    };

    const filteredData = filterByGenre(data, selectedGenre);

    // Sort the filteredData alphabetically by title
    filteredData.sort((a, b) => {
        const titleA = a.title.toUpperCase(); // ignore upper and lowercase
        const titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (sortOrder === 'asc') {
            return titleA.localeCompare(titleB);
        } else {
            return titleB.localeCompare(titleA);
        }
    });

    // Function to get genre title by ID
    const getGenreTitle = (genreId) => {
        const genre = genresData.find(genre => genre.id === genreId);
        return genre ? genre.title : 'Unknown Genre';
    };


    // Function to open modal and fetch show details
    const openModal = async (showId) => {
        try {
            const showDetails = await fetchShow(showId);
            setSelectedShow(showDetails);
            setCurrentSeasonIndex(0); // Reset season index when opening modal
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching show details:', error);
        }
    };

    // Close modal
    const closeModal = () => {
        setSelectedShow(null);
        setModalOpen(false);
    };

    // Handle next season click
    const nextSeason = () => {
        setCurrentSeasonIndex(prevIndex => prevIndex + 1);
    };

    // Handle previous season click
    const prevSeason = () => {
        setCurrentSeasonIndex(prevIndex => prevIndex - 1);
    };

    // Handle episode click
    const handleEpisodeClick = (episode) => {
        setCurrentEpisode(episode);
    };

    // Handle favorite click
    const toggleFavorite = (episode) => {
        const episodeId = `${selectedShow.id}-${currentSeasonIndex}-${episode.episode}`;
        if (favorites.includes(episodeId)) {
            setFavorites(favorites.filter(fav => fav !== episodeId));
        } else {
            setFavorites([...favorites, episodeId]);
        }
    };

    const isFavorite = (episode) => {
        return favorites.includes(`${selectedShow.id}-${currentSeasonIndex}-${episode.episode}`);
    };

    // Function to handle sorting based on user selection
    const handleSortOrder = (order) => {
        setSortOrder(order);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="cards-list">
            <div className="sort-options">
                <button className={`btn ${sortOrder === 'asc' ? 'active' : ''}`} onClick={() => handleSortOrder('asc')}>A-Z</button>
                <button className={`btn ${sortOrder === 'desc' ? 'active' : ''}`} onClick={() => handleSortOrder('desc')}>Z-A</button>
            </div>
            {filteredData.map(item => (
                <div key={item.id} className="card">
                    <div className="card-image">
                        <img src={item.image} alt={item.title} />
                    </div>
                    <div className="card-content">
                        <h2>{item.title}</h2>    
                        <p><strong>Genre:</strong> {getGenreTitle(item.genres[0])}</p>
                        <p><strong>Seasons:</strong> {item.seasons}</p>
                        <p><strong>Updated:</strong> {new Date(item.updated).toLocaleDateString()}</p>
                        <button className="btn" onClick={() => openModal(item.id)}>View Details</button>
                    </div>
                </div>
            ))}
            {modalOpen && selectedShow && (
    <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span> 
            <img 
                src={selectedShow.seasons[currentSeasonIndex].image} 
                alt={selectedShow.title} 
                className="modal-image" 
            />
            <h2>{selectedShow.title}</h2>
            <p>{selectedShow.description}</p> 
            <div className="season-nav">
                {selectedShow.seasons.map((season, index) => (
                    <button
                        key={index}
                        className={`season-button ${index === currentSeasonIndex ? 'active' : ''}`}
                        onClick={() => setCurrentSeasonIndex(index)}
                    >
                        Season {season.season}
                    </button>
                ))}
            </div>{currentEpisode && (
                            <div className="audio-player">
                                <h4>Now Playing: {currentEpisode.title}</h4>
                                <audio controls src={currentEpisode.file}>
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
            <h3>{selectedShow.seasons[currentSeasonIndex].title}</h3>
            <ul className="episode-list">
                            {selectedShow.seasons[currentSeasonIndex].episodes.map(episode => (
                                <li key={episode.episode} onClick={() => handleEpisodeClick(episode)}>
                                    <strong>{episode.title}</strong>
                                    <p>{episode.description}</p>
                                    <button 
                                        className={`favorite-btn ${isFavorite(episode) ? 'favorited' : ''}`} 
                                        onClick={() => toggleFavorite(episode)}
                                    >
                                        {isFavorite(episode) ? 'Unfavorite' : 'Favorite'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="season-navigation">
                            {currentSeasonIndex > 0 && (
                                <button onClick={prevSeason}>Previous Season</button>
                            )}
                            {currentSeasonIndex < selectedShow.seasons.length - 1 && (
                                <button onClick={nextSeason}>Next Season</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Home;