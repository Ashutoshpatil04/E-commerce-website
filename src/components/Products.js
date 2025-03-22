import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Products = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 7999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'High-quality wireless headphones with noise cancellation.',
      category: 'Audio'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 15999,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Feature-rich smartwatch with health tracking.',
      category: 'Wearables'
    },
    {
      id: 3,
      name: 'Ultra Slim Laptop',
      price: 79999,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Powerful laptop for work and entertainment.',
      category: 'Computers'
    },
    {
      id: 4,
      name: 'Smartphone Pro',
      price: 55999,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Latest smartphone with advanced camera features.',
      category: 'Mobile'
    },
    {
      id: 5,
      name: 'Tablet Pro',
      price: 35999,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Versatile tablet for productivity and entertainment.',
      category: 'Tablets'
    },
    {
      id: 6,
      name: 'Gaming Console',
      price: 39999,
      image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Next-gen gaming console for immersive gaming experience.',
      category: 'Gaming'
    },
    {
      id: 7,
      name: 'Wireless Earbuds',
      price: 11999,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'True wireless earbuds with premium sound quality.',
      category: 'Audio'
    },
    {
      id: 8,
      name: 'Smart Home Hub',
      price: 23999,
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Control your smart home with voice commands.',
      category: 'Smart Home'
    },
    {
      id: 9,
      name: '4K Monitor',
      price: 31999,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Ultra-wide 4K monitor for immersive viewing experience.',
      category: 'Displays'
    }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" data-aos="fade-up">Our Products</h2>
      <div className="row">
        {products.map((product, index) => (
          <div 
            key={product.id} 
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
                />
                <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                  {product.category}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong className="text-primary">₹{product.price.toLocaleString('en-IN')}</strong>
                </p>
                <button className="btn btn-primary w-100">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .product-image {
          transition: transform 0.3s ease;
        }

        .card:hover .product-image {
          transform: scale(1.05);
        }

        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .badge {
          transition: transform 0.3s ease;
        }

        .badge:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default Products; 