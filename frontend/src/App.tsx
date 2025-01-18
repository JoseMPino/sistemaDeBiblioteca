import './App.css'
import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';

import Libros from './pages/Libros';
import Admin from './pages/Autenticacion';
import AtenticacionUser from './pages/RegistroUser';
import PanelAdmin from './pages/PanelAdmin';
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Libros />} />
        <Route path="/login" element={<Admin />} />
        <Route path="/registro" element={<AtenticacionUser />} />
        <Route path="/panel-admin" element={<PanelAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
