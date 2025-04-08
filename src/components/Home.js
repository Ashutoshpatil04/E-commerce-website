import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { toast } from 'react-toastify';
import { productAPI } from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const { user } = useContext(UserContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll();
      // Get first 3 products as featured
      const products = response.data.data.slice(0, 3);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
        toast.info(`Increased ${product.name} quantity in cart`);
      } else {
        cart.push({ product, quantity: 1 });
        toast.success(`Added ${product.name} to cart`);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-md-6" data-aos="fade-right">
              {user ? (
                <div className="welcome-back mb-4">
                  <h2 className="text-primary">Welcome back, {user.name}!</h2>
                  <p className="lead">Ready to continue your tech journey?</p>
                </div>
              ) : (
                <h1 className="display-1 fw-bold mb-4 hero-title">
                  Welcome to TechTrendz
                </h1>
              )}
              <p className="lead mb-4 hero-subtitle">
                Discover the latest in technology with our curated collection of premium gadgets and accessories.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg hero-cta">
                {user ? 'Continue Shopping' : 'Shop Now'}
              </Link>
            </div>
            <div className="col-md-6" data-aos="fade-left">
              <div className="hero-image-wrapper">
                <img 
                  alt="TechTrendz Hero" 
                  className="img-fluid hero-image" 
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                />
                <div className="hero-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card">
                <i className="fas fa-shipping-fast feature-icon"></i>
                <h3>Fast Delivery</h3>
                <p>Free shipping on orders over ₹5000</p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card">
                <i className="fas fa-undo feature-icon"></i>
                <h3>Easy Returns</h3>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card">
                <i className="fas fa-headset feature-icon"></i>
                <h3>24/7 Support</h3>
                <p>Round-the-clock customer service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 section-title" data-aos="fade-up">Featured Products</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {featuredProducts.map((product, index) => (
                <div key={product._id} className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="product-card">
                    <div className="product-image-wrapper">
                      <img 
                        src={product.image} 
                        className="product-image" 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                        }}
                      />
                      <div className="product-overlay">
                        <Link 
                          to={`/products`} 
                          className="btn btn-light btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="product-info">
                      <h5 className="product-title">{product.name}</h5>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                      <button 
                        className="btn btn-primary w-100"
                        onClick={() => addToCart(product)}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <div className="bg-light py-5" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h3>Stay Updated with TechTrendz</h3>
              <p>Subscribe to our newsletter for the latest tech trends and exclusive offers!</p>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  aria-label="Email"
                />
                <button className="btn btn-primary hover-scale" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          overflow-x: hidden;
        }

        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          overflow: hidden;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.2;
          background: linear-gradient(45deg, #0d6efd, #0dcaf0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease forwards;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #6c757d;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease 0.3s forwards;
        }

        .hero-cta {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease 0.6s forwards;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          border-radius: 30px;
          background: linear-gradient(45deg, #0d6efd, #0dcaf0);
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2);
        }

        .hero-image-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .hero-image {
          width: 100%;
          height: auto;
          transition: transform 0.5s ease;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(13, 110, 253, 0.1), rgba(13, 202, 240, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hero-image-wrapper:hover .hero-image {
          transform: scale(1.05);
        }

        .hero-image-wrapper:hover .hero-overlay {
          opacity: 1;
        }

        .feature-card {
          padding: 2rem;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .feature-icon {
          font-size: 3rem;
          color: #0d6efd;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          padding-top: 100%;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #212529;
        }

        .product-description {
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0d6efd;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #212529;
          margin-bottom: 3rem;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background: linear-gradient(45deg, #0d6efd, #0dcaf0);
          border-radius: 3px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;