import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchPreview, fetchShow } from '../api';
import genresData from '../genresData';
import '../Home.css'

function Home() {
    const { id } = useParams();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const selectedGenre = id ? parseInt(id) : null;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [sortBy, setSortBy] = useState('title'); // 'title', 'date'
    const [audioPlaying, setAudioPlaying] = useState(false);
    
    // Detailed Modal state
    const [selectedShow, setSelectedShow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0); // State to track current season index
    const [currentEpisode, setCurrentEpisode] = useState(null); // State to track current episode
    const [favorites, setFavorites] = useState([]); // State to track favorite episodes
    const simpleModalRef = useRef(null);

    // Simple Modal state
    const [simpleModalOpen, setSimpleModalOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null); // State to track selected episode for simple modal
    const [seasonImage, setSeasonImage] = useState(''); // State to track the season image

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

    const filterBySearch = (items, query) => {
        if (!query) return items;
        return items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    };

    let filteredData = filterByGenre(data, selectedGenre);
    filteredData = filterBySearch(filteredData, searchQuery);

    // Sort the filteredData
    filteredData.sort((a, b) => {
        if (sortBy === 'title') {
            const titleA = a.title.toUpperCase(); // ignore upper and lowercase
            const titleB = b.title.toUpperCase(); // ignore upper and lowercase
            if (sortOrder === 'asc') {
                return titleA.localeCompare(titleB);
            } else {
                return titleB.localeCompare(titleA);
            }
        } else if (sortBy === 'date') {
            const dateA = new Date(a.updated);
            const dateB = new Date(b.updated);
            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        }
        return 0;
    });

    // Function to get genre title by ID
    const getGenreTitle = (genreId) => {
        const genre = genresData.find(genre => genre.id === genreId);
        return genre ? genre.title : 'Unknown Genre';
    };

    // Function to open detailed modal and fetch show details
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

    // Function to close detailed modal
    const closeModal = () => {
        setSelectedShow(null);
        setModalOpen(false);
    };

    // Function to open simple modal with episode details
    const openSimpleModal = (episode, seasonImage) => {
        setSelectedEpisode(episode);
        setSeasonImage(seasonImage);
        console.log('Opening Simple Modal with episode:', episode);
        setSimpleModalOpen(true);
    };

    // Function to close simple modal
    const closeSimpleModal = () => {
        setSelectedEpisode(null);
        setSeasonImage(''); // Reset season image
        setSimpleModalOpen(false);
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
    const handleEpisodeClick = (episode, seasonImage) => {
        setCurrentEpisode(episode);
        openSimpleModal(episode, seasonImage); // Open simple modal on episode click
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

    const handleSortBy = (sortBy) => {
        setSortBy(sortBy);
    };

    // Function to handle audio play
    const handleAudioPlay = () => {
        setAudioPlaying(true);
    };

    // Function to handle audio pause or end
    const handleAudioPause = () => {
        setAudioPlaying(false);
    };

    // Function to reset all progress
    const resetAllProgress = () => {
        setFavorites([]); // Clear favorites
        // You can add more state resets or localStorage clears if needed
        localStorage.removeItem('favorites'); // Remove favorites from localStorage
        alert('All progress has been reset.'); // Notify user
    };

    // Event listener for beforeunload
    window.onbeforeunload = (event) => {
        if (audioPlaying) {
            const message = 'Audio is currently playing. Are you sure you want to leave?';
            event.returnValue = message; // Standard for most browsers
            return message; // Required for Chrome
        }
    };

    const handleDragStart = (e) => {
        const rect = simpleModalRef.current.getBoundingClientRect();
        e.dataTransfer.setData('application/json', JSON.stringify({
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const modal = simpleModalRef.current;
        modal.style.left = `${e.clientX - data.offsetX}px`;
        modal.style.top = `${e.clientY - data.offsetY}px`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="cards-list" onDragOver={handleDragOver} onDrop={handleDrop}>
            {/* Simple Modal */}
            {simpleModalOpen && selectedEpisode && (
                <div className="simple-modal">
                    <div
                        className="simple-modal-content"
                        draggable
                        onDragStart={handleDragStart}
                        ref={simpleModalRef}
                    >
                        <span className="close" onClick={closeSimpleModal}>&times;</span>
                        <img 
                            src={seasonImage} // Use the season image
                            alt={selectedEpisode.title} 
                            className="modal-image" 
                        />
                        <h2>{selectedEpisode.title}</h2>
                        <div className="audio-player">
                            <h4>Now Playing: {selectedEpisode.title}</h4>
                            <audio controls src={selectedEpisode.file}
                            onPlay={handleAudioPlay}
                            onPause={handleAudioPause}
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
            )}
            <div className="sort-options">
                <button className={`btn ${sortBy === 'title' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { handleSortBy('title'); handleSortOrder('asc'); }}>A-Z</button>
                <button className={`btn ${sortBy === 'title' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { handleSortBy('title'); handleSortOrder('desc'); }}>Z-A</button>
                <button className={`btn ${sortBy === 'date' && sortOrder === 'desc' ? 'active' : ''}`} onClick={() => { handleSortBy('date'); handleSortOrder('desc'); }}>Newest</button>
                <button className={`btn ${sortBy === 'date' && sortOrder === 'asc' ? 'active' : ''}`} onClick={() => { handleSortBy('date'); handleSortOrder('asc'); }}>Oldest</button>
                <button className="btn reset-btn" onClick={resetAllProgress}>Reset All Progress</button>
            </div>
            <div className="card-container">
            {filteredData.map(item => (
                <div key={item.id} className="card">
                    <div className="card-image">
                        <img src={item.image} alt={item.title} />
                    </div>
                    <div className="card-properties">
                        <h2>{item.title}</h2>    
                        <p><strong>Genre:</strong> {getGenreTitle(item.genres[0])}</p>
                        <p><strong>Seasons:</strong> {item.seasons}</p>
                        <p><strong>Updated:</strong> {new Date(item.updated).toLocaleDateString()}</p>
                        <button className="btn" onClick={() => openModal(item.id)}>View Details</button>
                    </div>
                </div>
            ))}
            </div>
            {/* Detailed Modal */}
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
                        </div>
                        {currentEpisode &&  (
                            <div className="audio-player">
                                <h4>Now Playing: {currentEpisode.title}</h4>
                                <audio controls src={currentEpisode.file}
                                onPlay={handleAudioPlay}
                                onPause={handleAudioPause}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                        <h3>{selectedShow.seasons[currentSeasonIndex].title}</h3>
                        <ul className="episode-list">
                            {selectedShow.seasons[currentSeasonIndex].episodes.map(episode => (
                                <li key={episode.episode} onClick={() => handleEpisodeClick(episode, selectedShow.seasons[currentSeasonIndex].image)}>
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