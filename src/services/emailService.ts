
import { Order } from '../contexts/OrderContext';

interface EmailTemplate {
  subject: string;
  body: string;
}

export const sendOrderConfirmationEmail = async (order: Order): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const template = getEmailTemplate(order);
  
  console.log('Sending email via Mailtrap...');
  console.log('To:', order.customerInfo.email);
  console.log('Subject:', template.subject);
  console.log('Body:', template.body);

  const emailData = {
    to: order.customerInfo.email,
    subject: template.subject,
    html: template.body,
    from: 'orders@ecommerce-store.com'
  };

  try {
    const response = await simulateMailtrapSend(emailData);
    return response.success;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const getEmailTemplate = (order: Order): EmailTemplate => {
  if (order.status === 'approved') {
    return {
      subject: `Order Confirmation - ${order.orderNumber}`,
      body: `
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
      body: `
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

const simulateMailtrapSend = async (emailData: any): Promise<{ success: boolean }> => {
  console.log('Simulating Mailtrap SMTP send...');
  console.log('SMTP Host: sandbox.smtp.mailtrap.io');
  console.log('SMTP Port: 2525');
  console.log('Email Data:', emailData);
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: Math.random() > 0.1 });
    }, 500);
  });
};
