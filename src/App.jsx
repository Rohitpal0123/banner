import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Banner from './components/Banner';
import BannerForm from './components/BannerForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/banner-controls" element={<BannerForm />} />
      </Routes>
    </Router>
  );
}

export default App;
