
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

const getEmailTemplate = (order) => {
  if (order.status === 'approved') {
    return {
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Order Confirmed!</h2>
          <p>Hi ${order.customerInfo.fullName},</p>
          <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Product:</strong> ${order.productInfo.name}</p>
            <p><strong>Variant:</strong> ${order.productInfo.selectedColor} / ${order.productInfo.selectedSize}</p>
            <p><strong>Quantity:</strong> ${order.productInfo.quantity}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
            <h3>Shipping Address</h3>
            <p>${order.customerInfo.fullName}<br>
            ${order.customerInfo.address}<br>
            ${order.customerInfo.city}, ${order.customerInfo.state} ${order.customerInfo.zipCode}</p>
          </div>
          
          <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `
    };
  } else {
    return {
      subject: `Payment Failed - Order ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Payment Failed</h2>
          <p>Hi ${order.customerInfo.fullName},</p>
          <p>Unfortunately, your payment could not be processed.</p>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What happened?</h3>
            <p>Your order for ${order.productInfo.name} could not be completed due to a payment issue.</p>
            <p><strong>Status:</strong> ${order.status === 'declined' ? 'Payment Declined' : 'Gateway Error'}</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
            <h3>Next Steps</h3>
            <p>• Check your payment details and try again</p>
            <p>• Contact your bank if the issue persists</p>
            <p>• Reach out to our support team for assistance</p>
          </div>
          
          <p style="margin-top: 30px;">We're here to help! Contact us at support@ecommerce-store.com</p>
        </div>
      `
    };
  }
};

const sendOrderEmail = async (order) => {
  try {
    const template = getEmailTemplate(order);
    
    const mailOptions = {
      from: 'orders@ecommerce-store.com',
      to: order.customerInfo.email,
      subject: template.subject,
      html: template.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${order.customerInfo.email} for order ${order.orderNumber}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendOrderEmail };
