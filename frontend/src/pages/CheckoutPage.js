
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';

const CheckoutPage = () => {
  const { cartItem } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cartItem) {
      navigate('/');
    }
  }, [cartItem, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(customerInfo.phone)) newErrors.phone = 'Phone is invalid';
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
    if (!customerInfo.city.trim()) newErrors.city = 'City is required';
    if (!customerInfo.state.trim()) newErrors.state = 'State is required';
    if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'Zip code is required';

    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = 'Use MM/YY format';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3}$/.test(paymentInfo.cvv)) newErrors.cvv = 'CVV must be 3 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customerInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: paymentInfo.cardNumber.replace(/\s/g, '')
        },
        productInfo: cartItem
      };

      const response = await orderService.createOrder(orderData);
      
      localStorage.setItem('lastOrderNumber', response.data.orderNumber);
      navigate('/thank-you');
    } catch (error) {
      setErrors({ submit: 'Failed to process order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cartItem) {
    return null;
  }

  const subtotal = cartItem.price * cartItem.quantity;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
        Checkout
      </h1>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="card">
            <h2 style={{ marginBottom: '24px' }}>Customer Information</h2>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                  className="form-input"
                  placeholder="John Doe"
                />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="form-input"
                  placeholder="john@example.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="form-input"
                placeholder="(555) 123-4567"
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                className="form-input"
                placeholder="123 Main Street"
              />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>

            <div className="grid grid-3">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                  className="form-input"
                  placeholder="New York"
                />
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  value={customerInfo.state}
                  onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                  className="form-input"
                  placeholder="NY"
                />
                {errors.state && <div className="form-error">{errors.state}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Zip Code *</label>
                <input
                  type="text"
                  value={customerInfo.zipCode}
                  onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                  className="form-input"
                  placeholder="10001"
                />
                {errors.zipCode && <div className="form-error">{errors.zipCode}</div>}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '24px' }}>Payment Information</h2>

            <div className="form-group">
              <label className="form-label">Card Number *</label>
              <input
                type="text"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                className="form-input"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                  className="form-input"
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiryDate && <div className="form-error">{errors.expiryDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">CVV *</label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                  className="form-input"
                  placeholder="123"
                  maxLength="3"
                />
                {errors.cvv && <div className="form-error">{errors.cvv}</div>}
              </div>
            </div>

            <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginTop: '20px' }}>
              <h4 style={{ color: '#d97706', marginBottom: '8px' }}>Test CVV Codes:</h4>
              <div style={{ fontSize: '14px', color: '#92400e' }}>
                <div>• 111 = Approved Transaction</div>
                <div>• 222 = Declined Transaction</div>
                <div>• 333 = Gateway Error</div>
                <div>• Any other 3-digit = Approved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: '20px' }}>
          <h2 style={{ marginBottom: '24px' }}>Order Summary</h2>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <img
              src={cartItem.image}
              alt={cartItem.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{cartItem.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {cartItem.selectedColor} / {cartItem.selectedSize}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Qty: {cartItem.quantity}
              </p>
            </div>
            <div style={{ fontWeight: '600' }}>
              ${(cartItem.price * cartItem.quantity).toFixed(2)}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping</span>
              <span style={{ color: '#10b981' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="btn"
            style={{ width: '100%', marginTop: '24px', fontSize: '16px' }}
          >
            {isProcessing ? 'Processing...' : `Complete Order - $${total.toFixed(2)}`}
          </button>

          {errors.submit && (
            <div className="form-error" style={{ textAlign: 'center', marginTop: '12px' }}>
              {errors.submit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
