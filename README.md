# Productr - Product Management Admin Panel

A full-stack product management admin panel built with React.js, Node.js, Express.js, and MongoDB. This application allows you to manage products, publish/unpublish them, and organize your product catalog efficiently.

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
