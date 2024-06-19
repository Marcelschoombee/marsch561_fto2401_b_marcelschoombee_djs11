import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const Modal = ({ show, onClose }) => {
    const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0); // State to track current season index

    // Handle next season click
    const nextSeason = () => {
        setCurrentSeasonIndex(prevIndex => prevIndex + 1);
    };

    // Handle previous season click
    const prevSeason = () => {
        setCurrentSeasonIndex(prevIndex => prevIndex - 1);
    };

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{show.title}</h2>
                <img src={show.image} alt={show.title} className="modal-image" />
                <div className="season-nav">
                    {show.seasons.map((season, index) => (
                        <button
                            key={index}
                            className={`season-button ${index === currentSeasonIndex ? 'active' : ''}`}
                            onClick={() => setCurrentSeasonIndex(index)}
                        >
                            Season {season.season}
                        </button>
                    ))}
                </div>
                <h3>{show.seasons[currentSeasonIndex].title}</h3>
                <ul className="episode-list">
                    {show.seasons[currentSeasonIndex].episodes.map(episode => (
                        <li key={episode.episode}>
                            <strong>{episode.title}</strong>
                            <p>{episode.description}</p>
                        </li>
                    ))}
                </ul>
                <div className="season-navigation">
                    {currentSeasonIndex > 0 && (
                        <button onClick={prevSeason}>Previous Season</button>
                    )}
                    {currentSeasonIndex < show.seasons.length - 1 && (
                        <button onClick={nextSeason}>Next Season</button>
                    )}
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    show: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};
