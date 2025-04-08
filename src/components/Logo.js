import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = ({ className = 'auth-logo' }) => {
  return (
    <Link className={className} to="/">
      <div className="logo-container">
        <svg 
          className="logo-image" 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="19" stroke="url(#gradient1)" strokeWidth="2"/>
          <circle cx="20" cy="20" r="15" stroke="url(#gradient2)" strokeWidth="2"/>
          <path 
            d="M15 20h10M20 15v10" 
            stroke="url(#gradient1)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d6efd"/>
              <stop offset="1" stopColor="#0dcaf0"/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0dcaf0"/>
              <stop offset="1" stopColor="#0d6efd"/>
            </linearGradient>
          </defs>
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