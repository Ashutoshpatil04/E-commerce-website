import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const onLogout = () => {
    handleLogout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const commonLinks = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/products', label: 'Products', icon: 'fas fa-box' },
    { path: '/cart', label: 'Cart', icon: 'fas fa-shopping-cart' }
  ];

  // Add admin link if user is admin
  if (user?.isAdmin) {
    commonLinks.push({ 
      path: '/admin', 
      label: 'Admin Dashboard', 
      icon: 'fas fa-user-shield',
      className: 'admin-link'
    });
  }

  const authLinks = user
    ? [
        { 
          path: '/profile', 
          label: user.name, 
          icon: 'fas fa-user',
          className: 'user-link'
        },
        { 
          path: '#', 
          label: 'Logout', 
          icon: 'fas fa-sign-out-alt',
          onClick: onLogout,
          className: 'logout-link'
        }
      ]
    : [
        { 
          path: '/signin', 
          label: 'Sign In', 
          icon: 'fas fa-sign-in-alt'
        },
        { 
          path: '/signup', 
          label: 'Sign Up', 
          icon: 'fas fa-user-plus'
        }
      ];

  const navLinks = [...commonLinks, ...authLinks];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/logo192.png" 
            alt="TechTrendz Logo" 
            height="40" 
            className="me-2"
          />
          <span className="fw-bold text-primary">TechTrendz</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {navLinks.map((link, index) => (
              <li className="nav-item" key={link.path + index}>
                {link.onClick ? (
                  <button
                    className={`nav-link btn btn-link px-3 mx-2 ${link.className || ''}`}
                    onClick={() => {
                      link.onClick();
                      setIsOpen(false);
                    }}
                  >
                    <i className={`${link.icon} me-2`}></i>
                    {link.label}
                  </button>
                ) : (
                  <Link
                    className={`nav-link px-3 mx-2 ${
                      isActive(link.path) ? 'active fw-bold' : ''
                    } ${link.className || ''}`}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <i className={`${link.icon} me-2`}></i>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 