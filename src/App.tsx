/* eslint-disable max-len */
import { Route, Routes } from 'react-router-dom';
import { PeoplePage } from './components/PeoplePage/PeoplePage';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';

import './App.scss';

export const App = () => {
  return (
    <div data-cy="app">
      <Navbar />

      <div className="section">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<h1 className="title">Page not found</h1>} />
            <Route path="/people" element={<PeoplePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
