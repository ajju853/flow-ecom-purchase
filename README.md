
# eCommerce Checkout Flow Simulation

A complete 3-page eCommerce checkout simulation with frontend/backend separation, demonstrating real-world transaction handling, form validation, database operations, and email notifications.

## 🏗️ Project Structure

```
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── contexts/       # React context
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── public/
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

3. Seed database and start server:
```bash
node seedData.js
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

## 📋 Features

### Landing Page
- Product image, title, description, and price
- Color and size variant selectors
- Quantity selector with increment/decrement
- "Buy Now" button with dynamic pricing

### Checkout Page
- Complete customer information form
- Payment details with real-time formatting
- Dynamic order summary
- Frontend validation with error handling
- Transaction simulation via CVV codes

### Thank You Page
- Database-fetched order details
- Customer information display
- Order status with appropriate messaging
- Email confirmation simulation

## 🧪 Payment Testing

Use these CVV codes to simulate different payment outcomes:

| CVV | Result |
|-----|--------|
| 111 | ✅ Approved Transaction |
| 222 | ❌ Declined Transaction |
| 333 | ⚠️ Gateway Error |
| Any other 3-digit | ✅ Approved |

## 📧 Email Integration

Configured with Mailtrap.io for email simulation:
- Order confirmation emails for approved transactions
- Payment failure notifications
- Separate templates for different outcomes

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Nodemailer for email
- Express Validator for validation

**Email Service:**
- Mailtrap.io (sandbox mode)

## 🎯 Key Features Demonstrated

- **Frontend/Backend Separation**: Clean API architecture
- **Form Validation**: Real-time client-side validation
- **Database Operations**: MongoDB with proper data modeling
- **Transaction Simulation**: Multiple payment outcome scenarios
- **Email Notifications**: Template-based email system
- **Error Handling**: Comprehensive error management
- **Responsive Design**: Mobile-friendly interface

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
# Deploy to Railway or Render
# Set environment variables in hosting platform
```

## 🔧 Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `MAILTRAP_HOST`: Mailtrap SMTP host
- `MAILTRAP_PORT`: Mailtrap SMTP port
- `MAILTRAP_USER`: Mailtrap username
- `MAILTRAP_PASS`: Mailtrap password

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id/inventory` - Update inventory

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order by number

## 🧩 Database Schema

### Product
- id, name, description, price
- image, variants (color/size)
- inventory count

### Order
- orderNumber (unique)
- customerInfo (contact + address)
- paymentInfo (masked card details)
- productInfo (selected product + variants)
- status, total, timestamps

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-optimized layouts
- Touch-friendly interfaces
- Adaptive grid systems
- Optimized form inputs

This project demonstrates a complete eCommerce checkout flow with proper separation of concerns, comprehensive error handling, and real-world simulation capabilities.
