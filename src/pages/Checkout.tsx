
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from '../contexts/CartContext';
import { useOrder, CustomerInfo, PaymentInfo } from '../contexts/OrderContext';
import { processPayment } from '../services/paymentService';
import { databaseService } from '../services/databaseService';
import { sendOrderConfirmationEmail } from '../services/emailService';
import { validateEmail, validatePhone, validateCardNumber, validateExpiryDate, validateCVV, validateRequired } from '../utils/validation';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { cartItem } = useCart();
  const { addOrder } = useOrder();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cartItem) {
      navigate('/');
    }
  }, [cartItem, navigate]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    const requiredFields = [
      { field: 'fullName', value: customerInfo.fullName, label: 'Full Name' },
      { field: 'address', value: customerInfo.address, label: 'Address' },
      { field: 'city', value: customerInfo.city, label: 'City' },
      { field: 'state', value: customerInfo.state, label: 'State' },
      { field: 'zipCode', value: customerInfo.zipCode, label: 'Zip Code' }
    ];

    requiredFields.forEach(({ field, value, label }) => {
      const validation = validateRequired(value, label);
      if (!validation.isValid) {
        newErrors[field] = validation.message!;
      }
    });

    const emailValidation = validateEmail(customerInfo.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message!;
    }

    const phoneValidation = validatePhone(customerInfo.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message!;
    }

    const cardValidation = validateCardNumber(paymentInfo.cardNumber);
    if (!cardValidation.isValid) {
      newErrors.cardNumber = cardValidation.message!;
    }

    const expiryValidation = validateExpiryDate(paymentInfo.expiryDate);
    if (!expiryValidation.isValid) {
      newErrors.expiryDate = expiryValidation.message!;
    }

    const cvvValidation = validateCVV(paymentInfo.cvv);
    if (!cvvValidation.isValid) {
      newErrors.cvv = cvvValidation.message!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItem) return;
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const paymentResult = await processPayment(customerInfo, paymentInfo, cartItem);
      
      const order = {
        id: Date.now().toString(),
        orderNumber: paymentResult.orderNumber || `FAILED-${Date.now()}`,
        customerInfo,
        paymentInfo: { ...paymentInfo, cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4) },
        productInfo: cartItem,
        status: paymentResult.status,
        total: cartItem.price * cartItem.quantity,
        createdAt: new Date().toISOString()
      };

      await databaseService.saveOrder(order);
      addOrder(order);

      await sendOrderConfirmationEmail(order);

      if (paymentResult.success) {
        toast({
          title: "Order Placed Successfully!",
          description: `Order ${order.orderNumber} has been confirmed`,
        });
      } else {
        toast({
          title: "Payment Failed",
          description: paymentResult.message,
          variant: "destructive"
        });
      }

      navigate('/thank-you');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cartItem) {
    return null;
  }

  const subtotal = cartItem.price * cartItem.quantity;
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="checkout-card">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                      className={errors.fullName ? 'border-red-500' : ''}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className={errors.email ? 'border-red-500' : ''}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className={errors.phone ? 'border-red-500' : ''}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className={errors.address ? 'border-red-500' : ''}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className={errors.city ? 'border-red-500' : ''}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      className={errors.state ? 'border-red-500' : ''}
                      placeholder="NY"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      value={customerInfo.zipCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                      className={errors.zipCode ? 'border-red-500' : ''}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="checkout-card">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                    className={errors.cardNumber ? 'border-red-500' : ''}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                      className={errors.expiryDate ? 'border-red-500' : ''}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                      className={errors.cvv ? 'border-red-500' : ''}
                      placeholder="123"
                      maxLength={3}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Test Payment Instructions:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• CVV 111 = Approved Transaction</li>
                    <li>• CVV 222 = Declined Transaction</li>
                    <li>• CVV 333 = Gateway Failure</li>
                    <li>• Any other CVV = Approved</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="checkout-card sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={cartItem.image}
                    alt={cartItem.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{cartItem.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cartItem.selectedColor} / {cartItem.selectedSize}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {cartItem.quantity}</p>
                  </div>
                  <p className="font-medium">${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Complete Order - $${total.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
