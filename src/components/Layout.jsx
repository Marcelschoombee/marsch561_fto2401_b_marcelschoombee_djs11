import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';


const Layout = ({onGenreSelect, genresData }) => {
    return (
        <div>
            
        <main>
            <Header onGenreSelect={onGenreSelect} genresData={genresData} />
            <Outlet />
            <Footer /> 
        </main>
         
        </div>
    );
}

export default Layout;