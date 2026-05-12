import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Farmers from './pages/Farmers';
import Buyers from './pages/Buyers';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/farmers"      element={<Farmers />} />
        <Route path="/buyers"       element={<Buyers />} />
        <Route path="/about"        element={<About />} />
        <Route path="/contact"      element={<Contact />} />
        <Route path="/privacy"      element={<Privacy />} />
        <Route path="/terms"        element={<Terms />} />
        <Route path="/cookies"      element={<Cookies />} />
      </Routes>
    </BrowserRouter>
  );
}
