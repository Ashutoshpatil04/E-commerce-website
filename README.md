# E-commerce Website

A full-stack e-commerce website built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (Sign up, Sign in, Sign out)
- Product management (CRUD operations)
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design

## Project Structure

```
E-commerce-website/
├── frontend/          # React frontend
├── backend/           # Node.js backend
└── README.md         # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on http://localhost:3000

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend will run on http://localhost:3001

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_CODE=your_admin_code
```

## Available Scripts

### Frontend

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Backend

- `npm start`: Start production server
- `npm run dev`: Start development server
- `npm test`: Run tests

## API Endpoints

### Auth Routes
- POST `/api/auth/signup`: Register a new user
- POST `/api/auth/signin`: Login user

### Product Routes
- GET `/api/products`: Get all products
- GET `/api/products/:id`: Get single product
- POST `/api/products`: Create new product (Admin only)
- PUT `/api/products/:id`: Update product (Admin only)
- DELETE `/api/products/:id`: Delete product (Admin only)

### User Routes
- GET `/api/users`: Get all users (Admin only)
- GET `/api/users/:id`: Get user profile
- PUT `/api/users/:id`: Update user
- DELETE `/api/users/:id`: Delete user

### Order Routes
- GET `/api/orders`: Get all orders (Admin only)
- GET `/api/orders/:id`: Get single order
- POST `/api/orders`: Create new order
- PUT `/api/orders/:id`: Update order
- PATCH `/api/orders/:id/status`: Update order status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 