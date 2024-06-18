import React from 'react';
import PropTypes from 'prop-types';
import genresData from '../genre'

const Card = ({ title, description, genres: genreIds, image, url }) => {
  // Map genre IDs to genre titles using the imported genresData
  const genreTitles = genreIds.map(genreId => genresData[genreId]).join(', ');

  return (
    <a href={url} className="card" target="_blank" rel="noopener noreferrer">
      <img
        src={image}
        className="card--image"
        alt={title}
      />
      <h4 className="card--title">{title}</h4>
      <p>{description}</p>
      <p><strong>Genres:</strong> {genreTitles}</p>
    </a>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.number).isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Card;