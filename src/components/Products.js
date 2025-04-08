import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await productAPI.getAll();
      console.log('API Response:', response);
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        console.log('Products loaded:', response.data.data);
      } else {
        console.error('Invalid products data:', response?.data);
        setProducts([]);
        setError('No products available');
        toast.error('Error: No products available');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      setProducts([]);
      setError(error.message);
      toast.error(`Error loading products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Product added to cart');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>No Products Available</h2>
          <p>Check back later for new products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" data-aos="fade-up">Our Products</h2>
      <div className="row">
        {products.map((product, index) => (
          <div 
            key={product._id} 
            className="col-md-4 mb-4" 
            data-aos="fade-up" 
            data-aos-delay={index * 100}
          >
            <div className="card h-100 shadow-sm">
              <div className="position-relative">
                <img 
                  src={product.image} 
                  className="card-img-top product-image" 
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                />
                <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                  {product.category}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong className="text-primary">₹{product.price?.toLocaleString('en-IN') || 0}</strong>
                </p>
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
    </div>
  );
};

export default Products;