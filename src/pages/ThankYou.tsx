
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder, Order } from '../contexts/OrderContext';
import { useCart } from '../contexts/CartContext';
import { databaseService } from '../services/databaseService';

const ThankYou = () => {
  const { currentOrder } = useOrder();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (currentOrder) {
        setOrder(currentOrder);
        clearCart();
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const orderNumber = urlParams.get('order');
        
        if (orderNumber) {
          try {
            const fetchedOrder = await databaseService.getOrder(orderNumber);
            if (fetchedOrder) {
              setOrder(fetchedOrder);
            } else {
              navigate('/');
            }
          } catch (error) {
            console.error('Error fetching order:', error);
            navigate('/');
          }
        } else {
          navigate('/');
        }
      }
      setLoading(false);
    };

    loadOrder();
  }, [currentOrder, navigate, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Order Confirmed</Badge>;
      case 'declined':
        return <Badge className="bg-red-500 text-white">Payment Declined</Badge>;
      case 'failed':
        return <Badge className="bg-orange-500 text-white">Gateway Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: 'Order Confirmed!',
          message: 'Thank you for your purchase. Your order has been confirmed and is being processed.',
          icon: '✅'
        };
      case 'declined':
        return {
          title: 'Payment Declined',
          message: 'Your payment was declined by your bank. Please check your payment details and try again.',
          icon: '❌'
        };
      case 'failed':
        return {
          title: 'Gateway Error',
          message: 'A technical error occurred while processing your payment. Please try again or contact support.',
          icon: '⚠️'
        };
      default:
        return {
          title: 'Order Status Unknown',
          message: 'Please contact support for assistance.',
          icon: '❓'
        };
    }
  };

  const statusInfo = getStatusMessage(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-bounce-in">
          <div className="text-6xl mb-4">{statusInfo.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{statusInfo.title}</h1>
          <p className="text-xl text-gray-600">{statusInfo.message}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="checkout-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Details
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-bold text-lg">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Product Information</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={order.productInfo.image}
                    alt={order.productInfo.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{order.productInfo.name}</h4>
                    <p className="text-sm text-gray-500">
                      Color: {order.productInfo.selectedColor}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {order.productInfo.selectedSize}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {order.productInfo.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(order.productInfo.price * order.productInfo.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(order.total - (order.productInfo.price * order.productInfo.quantity)).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="checkout-card animate-fade-in">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Name:</span> {order.customerInfo.fullName}</p>
                  <p><span className="text-gray-500">Email:</span> {order.customerInfo.email}</p>
                  <p><span className="text-gray-500">Phone:</span> {order.customerInfo.phone}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="text-gray-700">
                  <p>{order.customerInfo.fullName}</p>
                  <p>{order.customerInfo.address}</p>
                  <p>{order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <p className="text-gray-700">Card ending in {order.paymentInfo.cardNumber.slice(-4)}</p>
              </div>

              {order.status === 'approved' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• You'll receive an email confirmation shortly</li>
                    <li>• Your order will be processed within 1-2 business days</li>
                    <li>• You'll get a tracking number once shipped</li>
                  </ul>
                </div>
              )}

              {(order.status === 'declined' || order.status === 'failed') && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Need Help?</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Check your payment details</li>
                    <li>• Contact your bank if needed</li>
                    <li>• Try again or contact our support</li>
                  </ul>
                  <Button 
                    onClick={() => navigate('/')} 
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white hover:bg-gray-50"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
