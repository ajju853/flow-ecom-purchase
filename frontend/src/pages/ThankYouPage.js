
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';

const ThankYouPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderNumber = localStorage.getItem('lastOrderNumber');
        if (!orderNumber) {
          navigate('/');
          return;
        }

        const response = await orderService.getOrder(orderNumber);
        setOrder(response.data);
        clearCart();
        localStorage.removeItem('lastOrderNumber');
      } catch (err) {
        setError('Order not found');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [navigate, clearCart]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          title: 'Order Confirmed!',
          message: 'Thank you for your purchase. Your order has been confirmed and is being processed.',
          icon: '✅',
          badgeClass: 'badge-success'
        };
      case 'declined':
        return {
          title: 'Payment Declined',
          message: 'Your payment was declined by your bank. Please check your payment details and try again.',
          icon: '❌',
          badgeClass: 'badge-error'
        };
      case 'failed':
        return {
          title: 'Gateway Error',
          message: 'A technical error occurred while processing your payment. Please try again or contact support.',
          icon: '⚠️',
          badgeClass: 'badge-warning'
        };
      default:
        return {
          title: 'Order Status Unknown',
          message: 'Please contact support for assistance.',
          icon: '❓',
          badgeClass: 'badge-error'
        };
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Error: {error}</h2>
        <p>Redirecting to home page...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Order not found</h2>
        <button onClick={() => navigate('/')} className="btn">
          Return to Shop
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{statusInfo.icon}</div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>{statusInfo.title}</h1>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>{statusInfo.message}</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Order Details</h2>
            <span className={`badge ${statusInfo.badgeClass}`}>
              {order.status === 'approved' ? 'Confirmed' : 
               order.status === 'declined' ? 'Declined' : 'Failed'}
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Order Number</p>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{order.orderNumber}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Order Date</p>
            <p style={{ fontWeight: '600' }}>
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Product Information</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img
                src={order.productInfo.image}
                alt={order.productInfo.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '4px' }}>{order.productInfo.name}</h4>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Color: {order.productInfo.selectedColor}
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Size: {order.productInfo.selectedSize}
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Quantity: {order.productInfo.quantity}
                </p>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                ${order.total.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal</span>
              <span>${(order.productInfo.price * order.productInfo.quantity).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping</span>
              <span style={{ color: '#10b981' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span>Tax</span>
              <span>${(order.total - (order.productInfo.price * order.productInfo.quantity)).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Customer Information</h2>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>Contact Information</h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p><strong>Name:</strong> {order.customerInfo.fullName}</p>
              <p><strong>Email:</strong> {order.customerInfo.email}</p>
              <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>Shipping Address</h3>
            <div style={{ color: '#374151' }}>
              <p>{order.customerInfo.fullName}</p>
              <p>{order.customerInfo.address}</p>
              <p>{order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>Payment Method</h3>
            <p>Card ending in {order.paymentInfo.cardNumber.slice(-4)}</p>
          </div>

          {order.status === 'approved' && (
            <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <h4 style={{ color: '#166534', marginBottom: '8px' }}>What's Next?</h4>
              <div style={{ fontSize: '14px', color: '#166534' }}>
                <div>• You'll receive an email confirmation shortly</div>
                <div>• Your order will be processed within 1-2 business days</div>
                <div>• You'll get a tracking number once shipped</div>
              </div>
            </div>
          )}

          {(order.status === 'declined' || order.status === 'failed') && (
            <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <h4 style={{ color: '#dc2626', marginBottom: '8px' }}>Need Help?</h4>
              <div style={{ fontSize: '14px', color: '#dc2626', marginBottom: '12px' }}>
                <div>• Check your payment details</div>
                <div>• Contact your bank if needed</div>
                <div>• Try again or contact our support</div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="btn"
                style={{ background: '#dc2626', fontSize: '14px', padding: '8px 16px' }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={() => navigate('/')}
          className="btn"
          style={{ background: '#6b7280' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
