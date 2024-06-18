import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Cards';
import { fetchPreview } from './api'; // Assuming you have an API utility function
import genres from './genre'; // Assuming you have a file with genre titles mapped to IDs

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const previewData = await fetchPreview(); // Fetch data from API
                setData(previewData); // Update state with fetched data
                setLoading(false); // Update loading state
            } catch (error) {
                setError(error.message); // Handle fetch error
                setLoading(false); // Update loading state
            }
        };

        fetchData(); // Call fetchData function on component mount
    }, []);

    if (loading) return <div>Loading...</div>; // Render loading indicator if data is still loading
    if (error) return <div>Error: {error}</div>; // Render error message if data fetch fails

    return (
        <>
            <div>
                <Header />
                <section className="cards-list">
                    {data.map(item => (
                        <Card
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            genres={item.genres} // Assuming genres is an array of genre IDs
                            image={item.image} // Image URL from API data
                            url={item.url} // Assuming url is the URL for the card link
                        />
                    ))}
                </section>
            </div>
            <Footer />
        </>
    );
}

export default App;