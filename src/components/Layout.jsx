import React from 'react';
import Header from './Header';
import Footer from './Footer'
import Home from '../pages/Home';


const Layout = ({ children, onGenreSelect, genresData }) => {
    return (
        <main>
            <Header onGenreSelect={onGenreSelect} genresData={genresData} />
            <Home>
                {children}
            </Home>
            <Footer />
        </main>
    );
}

export default Layout;