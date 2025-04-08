import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import 'react-toastify/dist/ReactToastify.css';
import '../components/Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms and Conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('Sending signup request with data:', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        adminCode: formData.adminCode || undefined
      });

      const response = await authAPI.signUp({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        adminCode: formData.adminCode || undefined
      });

      console.log('Signup response:', response);

      if (response.data.token && response.data.user) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        handleLogin(response.data.user);
        
        // Show success message
        toast.success('Registration successful! Welcome to TechTrendz');
        
        // Redirect to home page
        navigate('/');
      } else {
        console.error('Invalid response format:', response);
        toast.error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="text-muted mb-4">Join TechTrendz to start shopping</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your name"
              minLength="2"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Create a password"
              minLength="6"
            />
            <small className="text-muted">Must be at least 6 characters long</small>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Confirm your password"
            />
          </div>
          <div className="form-group">
            <label>Admin Code (optional)</label>
            <input
              type="text"
              name="adminCode"
              className="form-control"
              value={formData.adminCode}
              onChange={handleChange}
              placeholder="Enter admin code"
            />
          </div>
          <div className="form-group form-check">
            <input
              type="checkbox"
              name="agreeToTerms"
              className="form-check-input"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <label className="form-check-label">
              I agree to the Terms and Conditions
            </label>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp; 