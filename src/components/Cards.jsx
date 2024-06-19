import React, { useState } from 'react';
import PropTypes from 'prop-types';
import data from '../Data';
import genresData from '../genre';
import Modal from 'react-modal';
import '../App.css';

const Card = ({ title, description, genres: genreIds, image, url, seasons, updated }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(0);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const genreTitles = genreIds.map(genreId => genresData.find(genre => genre.id === genreId)?.title || 'Unknown Genre');

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const findShows = (id) => {
        const genreData = data.find(genre => genre.id === id);
        return genreData ? genreData.shows : [];
    };

    const relevantShows = findShows(3); // Assuming 3 is the genre id for History

    const handleSeasonChange = (index) => {
        setSelectedSeason(index);
    };

    const truncateDescription = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return `${text.substr(0, maxLength)}...`;
    };

    return (
        <div className="card">
            <div className="card-content" onClick={openModal}>
                <img src={image} className="card--image" alt={title} />
                <div className="card-details">
                    <h2 className="card-title">{title}</h2>
                    <p className="card-description">
                        {showFullDescription ? description : truncateDescription(description, 150)}
                        {!showFullDescription && description.length > 150 && (
                            <span className="read-more" onClick={toggleDescription}> Show more</span>
                        )}
                    </p>
                    <div className="card-genres">
                        {genreTitles.map((genreTitle, index) => (
                            <span key={index}>{genreTitle}</span>
                        ))}
                    </div>
                    <p className="card-seasons"><strong>Seasons:</strong> {seasons}</p>
                    <p className="card-updated"><strong>Updated:</strong> {new Date(updated).toLocaleDateString()}</p>
                    <a href={url} className="card-read-more" target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Card Details"
                className="modal"
                overlayClassName="overlay"
            >
                <button onClick={closeModal} className="close-button">X</button>
                <div className="modal-content">
                    <img src={image} className="modal-image" alt={title} />
                    <h2 className="modal-title">{title}</h2>
                    <p className="modal-description">{description}</p>
                    <div className="modal-genres">
                        <strong>Genres: </strong>
                        {genreTitles.join(', ')}
                    </div>
                    <div className="modal-seasons">
                        <strong>Seasons: </strong>
                        <div>
                            {relevantShows[0].seasons.map((season, index) => (
                                <button key={index} onClick={() => handleSeasonChange(index)}>{season.season}</button>
                            ))}
                        </div>
                    </div>
                    <div className="modal-episodes">
                        <strong>Episodes: </strong>
                        {relevantShows[0].seasons[selectedSeason].episodes.join(', ')}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.number).isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    seasons: PropTypes.number.isRequired,
    updated: PropTypes.string.isRequired,
};

export default Card;

