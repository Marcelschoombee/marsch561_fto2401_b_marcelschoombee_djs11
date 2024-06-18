import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Cards'; // Ensure this path is correct
import { fetchPreview } from '../api'; // Ensure this path is correct
import '../App.css';

function Home() {
    const { id } = useParams();
    const selectedGenre = id ? parseInt(id) : null;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const filterByGenre = (items, genreId) => {
        if (!genreId) return items;
        return items.filter(item => item.genres.includes(genreId));
    };

    const filteredData = filterByGenre(data, selectedGenre);

    filteredData.sort((a, b) => a.title.localeCompare(b.title)); // filteredData alphabetically by title

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="cards-list">
            {filteredData.map(item => (
                <Card
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    genres={item.genres}
                    image={item.image}
                    url={item.url}
                    seasons={item.seasons}
                    updated={item.updated}
                />
            ))}
        </section>
    );
}

export default Home;