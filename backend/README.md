
# eCommerce Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and configure:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

3. Seed the database:
```bash
node seedData.js
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id/inventory` - Update inventory

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order by order number

## Payment Simulation
Use CVV codes to simulate different outcomes:
- `111` = Approved Transaction
- `222` = Declined Transaction  
- `333` = Gateway Error
- Any other 3-digit CVV = Approved
