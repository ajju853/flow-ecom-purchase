
const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { sendOrderEmail } = require('../services/emailService');
const { generateOrderNumber, processPayment } = require('../services/orderService');
const router = express.Router();

const validateOrder = [
  body('customerInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').matches(/^\+?[\d\s\-\(\)]{10,}$/).withMessage('Valid phone number is required'),
  body('customerInfo.address').notEmpty().withMessage('Address is required'),
  body('customerInfo.city').notEmpty().withMessage('City is required'),
  body('customerInfo.state').notEmpty().withMessage('State is required'),
  body('customerInfo.zipCode').notEmpty().withMessage('Zip code is required'),
  body('paymentInfo.cardNumber').matches(/^\d{16}$/).withMessage('Card number must be 16 digits'),
  body('paymentInfo.expiryDate').matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('Expiry date must be MM/YY format'),
  body('paymentInfo.cvv').matches(/^\d{3}$/).withMessage('CVV must be 3 digits')
];

router.post('/', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerInfo, paymentInfo, productInfo } = req.body;
    
    const paymentResult = processPayment(paymentInfo.cvv);
    const orderNumber = generateOrderNumber();
    
    const order = new Order({
      orderNumber,
      customerInfo,
      paymentInfo: {
        ...paymentInfo,
        cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4)
      },
      productInfo,
      status: paymentResult.status,
      total: productInfo.price * productInfo.quantity
    });

    await order.save();
    
    await sendOrderEmail(order);
    
    res.json({
      success: paymentResult.success,
      orderNumber,
      status: paymentResult.status,
      message: paymentResult.message
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
