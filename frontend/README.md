
# eCommerce Frontend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

## Features

- **Landing Page**: Product display with variant selection
- **Checkout Page**: Complete customer and payment form with validation
- **Thank You Page**: Order confirmation with database-fetched data
- **Real-time Validation**: Frontend form validation
- **Responsive Design**: Mobile-friendly layout
- **Payment Simulation**: Test different payment outcomes with CVV codes

## Payment Testing

Use these CVV codes to simulate different outcomes:
- `111` = Approved Transaction
- `222` = Declined Transaction  
- `333` = Gateway Error
- Any other 3-digit CVV = Approved

## Build for Production

```bash
npm run build
```
