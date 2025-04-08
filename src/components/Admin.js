import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import { productAPI, userAPI, orderAPI } from '../services/api';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });

  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    rating: '',
    discount: '',
    offerPrice: ''
  });

  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        productAPI.getAll(),
        userAPI.getAll(),
        orderAPI.getAll()
      ]);

      if (!productsRes.data || !usersRes.data || !ordersRes.data) {
        throw new Error('Failed to fetch data from server');
      }

      setProducts(productsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setOrders(ordersRes.data.data || []);

      // Update stats
      const revenue = calculateTotalRevenue(ordersRes.data.data || []);
      setStats({
        totalProducts: productsRes.data.data.length,
        totalUsers: usersRes.data.data.length,
        totalOrders: ordersRes.data.data.length,
        revenue
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalRevenue = (orders) => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await productAPI.create(productForm);
      toast.success('Product added successfully!');
      fetchAllData();
      setProductForm({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        rating: '',
        discount: '',
        offerPrice: ''
      });
    } catch (err) {
      setError(err.message);
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        toast.success('Product deleted successfully');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateUserRole = async (userId, isAdmin) => {
    try {
      await userAPI.updateRole(userId, isAdmin ? 'user' : 'admin');
      toast.success('User role updated successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId);
        toast.success('User deleted successfully');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Order status updated successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const renderSidebar = () => (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <button
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="fas fa-chart-line"></i>
          Dashboard
        </button>
        <button
          className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <i className="fas fa-box"></i>
          Products
        </button>
        <button
          className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i>
          Users
        </button>
        <button
          className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <i className="fas fa-shopping-cart"></i>
          Orders
        </button>
      </nav>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-section">
      <h3>Dashboard Overview</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-box"></i>
          <h4>Total Products</h4>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <h4>Total Users</h4>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-shopping-cart"></i>
          <h4>Total Orders</h4>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-rupee-sign"></i>
          <h4>Total Revenue</h4>
          <p>₹{stats.revenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="chart-container">
            <h4>Recent Orders</h4>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="chart-container">
            <h4>Recent Users</h4>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Product Management</h3>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          <i className="fas fa-plus me-2"></i>Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{product.title}</td>
                <td>₹{product.price}</td>
                <td>{product.category}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setProductForm(product);
                        // Open edit modal
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Product</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Product Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        className="form-control"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Books">Books</option>
                        <option value="Toys">Toys</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Rating</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.rating}
                        onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                        min="1"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Offer Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.offerPrice}
                        onChange={(e) => setProductForm({ ...productForm, offerPrice: e.target.value })}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h3>User Management</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isAdmin ? 'bg-primary' : 'bg-secondary'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleUpdateUserRole(user._id, user.isAdmin)}
                      disabled={user._id === user?._id}
                    >
                      <i className="fas fa-exchange-alt"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user._id === user?._id}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <h3>Order Management</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.items?.length || 0} items</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin fa-3x"></i>
          <p>Loading admin dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-container">
          <div className="alert alert-danger">
            {error}
            <button className="btn btn-link" onClick={fetchAllData}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'users':
        return renderUsers();
      case 'orders':
        return renderOrders();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-container">
      {renderSidebar()}
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;