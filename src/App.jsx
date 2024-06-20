import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('title');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/genres/:id" element={<Home />} />
                </Route>
                <Route path="/favorites" element={<Favorites />}>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

// Example component for handling undefined routes
const NotFound = () => {
    return <h1>404 - Not Found</h1>;
};

export default App;
