import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';


function App() {
 

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/genres/:id" element={<Home />} />
                    <Route path="/Favorites" element={<Favorites />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


export default App;
