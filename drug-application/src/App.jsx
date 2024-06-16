// App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugSearch from './components/pages/DrugSearch';
import DrugDetails from './components/pages/DrugDetails';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DrugSearch />} />
        <Route path="/drugs/search" element={<DrugSearch />} />
        <Route path="/drugs/:drugName" element={<DrugDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
