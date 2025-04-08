import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Error loading cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.product._id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Product removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // Here you can implement the checkout process
    toast.success('Proceeding to checkout');
    navigate('/checkout');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading cart...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-8">
              {cart.map((item) => (
                <div key={item.product._id} className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-6">
                        <h5>{item.product.name}</h5>
                        <p>{item.product.description}</p>
                        <p>Price: ${item.product.price}</p>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex align-items-center">
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="btn btn-danger mt-2"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>Order Summary</h5>
                  <p>Total Items: {cart.length}</p>
                  <p>Total Price: ${calculateTotal().toFixed(2)}</p>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 