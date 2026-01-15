# Productr - Product Management Admin Panel

A full-stack product management admin panel built with React.js, Node.js, Express.js, and MongoDB. This application allows you to manage products, publish/unpublish them, and organize your product catalog efficiently.

## Features

- 🔐 **OTP-based Authentication** - Secure login and signup using OTP verification
- 📦 **Product Management** - Full CRUD operations for products
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔍 **Search & Filter** - Search products by name, brand, or type, and filter by publish status
- 📊 **Dashboard Stats** - View total products, published, and unpublished counts
- ✅ **Publish/Unpublish** - Toggle product visibility with a single click
- 🖼️ **Image Support** - Add multiple product images via URLs
- 💰 **Pricing Management** - Set MRP and selling price for products
- 🔄 **Exchange Eligibility** - Mark products as exchange eligible

## Tech Stack

### Frontend
- React.js 19.2.3
- React Router DOM 7.12.0
- Axios 1.13.2
- Modern CSS with inline styles

### Backend
- Node.js
- Express.js 4.19.2
- MongoDB with Mongoose 8.4.0
- JWT Authentication
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd panel-admin
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/productr
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGO_URI` in the `.env` file.

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

### Seed Sample Data (Optional)

To populate the database with sample products:

```bash
cd backend
npm run seed
```

This will add 8 sample products to your database.

## Project Structure

```
panel-admin/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── product.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── product.routes.js
│   │   ├── scripts/
│   │   │   └── seed.js         # Seed script for sample data
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── api.js          # Axios instance with interceptors
    │   │   ├── authApi.js      # Auth API calls
    │   │   └── productApi.js   # Product API calls
    │   ├── components/
    │   │   ├── ProductCard.js
    │   │   ├── ProductForm.js
    │   │   ├── ProductGrid.js
    │   │   └── ProductSearchBar.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── LoginPage.js
    │   │   └── SignupPage.js
    │   ├── auth/
    │   │   └── ProtectedRoute.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email/phone
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token

### Products (Protected Routes)
- `GET /api/products` - Get all products (supports `?search=query` and `?published=true/false`)
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `PATCH /api/products/:id/publish` - Toggle publish status

## Usage

### Authentication Flow

1. **Sign Up / Login**: Enter your email or phone number
2. **OTP Verification**: Enter the 6-digit OTP sent to your identifier
3. **Access Dashboard**: Once verified, you'll be redirected to the dashboard

### Product Management

1. **Add Product**: Fill in the product form and click "Add Product"
2. **Edit Product**: Click "Edit" on any product card, modify the details, and click "Update Product"
3. **Delete Product**: Click "Delete" and confirm the action
4. **Publish/Unpublish**: Toggle the publish status to control product visibility
5. **Search**: Use the search bar to find products by name, brand, or type
6. **Filter**: Use the dropdown to filter by publish status

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

## Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)
3. Deploy to platforms like Heroku, Railway, or Render

### Frontend Deployment

1. Update API base URL in `frontend/src/api/api.js` to your backend URL
2. Build the production version: `npm run build`
3. Deploy the `build` folder to platforms like Vercel, Netlify, or GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
