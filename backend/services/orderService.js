
const { v4: uuidv4 } = require('uuid');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

const processPayment = (cvv) => {
  if (cvv === '111') {
    return {
      success: true,
      status: 'approved',
      message: 'Payment processed successfully'
    };
  } else if (cvv === '222') {
    return {
      success: false,
      status: 'declined',
      message: 'Payment declined by bank'
    };
  } else if (cvv === '333') {
    return {
      success: false,
      status: 'failed',
      message: 'Gateway error occurred'
    };
  } else {
    return {
      success: true,
      status: 'approved',
      message: 'Payment processed successfully'
    };
  }
};

module.exports = { generateOrderNumber, processPayment };
