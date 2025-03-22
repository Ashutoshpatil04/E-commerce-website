import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link className="navbar-brand d-flex align-items-center" to="/">
      <div className="logo-container">
        <svg 
          className="logo-image" 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="19" stroke="#00ff88" strokeWidth="2"/>
          <circle cx="20" cy="20" r="15" stroke="#007bff" strokeWidth="2"/>
          <path 
            d="M20 12V28M12 20H28" 
            stroke="#00ff88" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="4" fill="#00ff88"/>
        </svg>
      </div>
      <div className="logo-text">
        <span className="logo-brand">Tech</span>
        <span className="logo-trendz">Trendz</span>
      </div>
    </Link>
  );
};

export default Logo; 