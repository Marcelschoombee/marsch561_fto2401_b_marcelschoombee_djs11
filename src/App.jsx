import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Favorites from './components/Favorites';

function App() {
   
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/genres/:id" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
