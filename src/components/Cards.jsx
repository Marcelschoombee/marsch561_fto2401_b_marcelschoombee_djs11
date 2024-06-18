import React from 'react';
import PropTypes from 'prop-types';
import genresData from '../genre';
import '../App.css';

const Card = ({ title, description, genres: genreIds, image, url, seasons, updated }) => {
    const genreTitles = genreIds.map(genreId => genresData.find(genre => genre.id === genreId)?.title);

    return (
        <div className="card">
            <img src={image} className="card--image" alt={title} />
            <div className="card-content">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
                <div className="card-genres">
                    {genreTitles.map((genreTitle, index) => (
                        <span key={index}>{genreTitle}</span>
                    ))}
                </div>
                <p className="card-seasons"><strong>Seasons:</strong> {seasons}</p>
                <p className="card-updated"><strong>Updated:</strong> {new Date(updated).toLocaleDateString()}</p>
            </div>
            <a href={url} className="card-link" target="_blank" rel="noopener noreferrer">Read more</a>
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