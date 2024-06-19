import React from 'react';
import Header from './Header';
import Footer from './Footer'
import Home from '../pages/Home';
import { Modal } from './Modal';


const Layout = ({ children, onGenreSelect, genresData }) => {
    return (
        <div>
        <main>
            <Header onGenreSelect={onGenreSelect} genresData={genresData} />
            <Home>
                {children}
                <Modal />
            </Home>
        </main>
        <Footer />
        </div>
    );
}

export default Layout;