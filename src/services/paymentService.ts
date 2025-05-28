
import { CustomerInfo, PaymentInfo, Order } from '../contexts/OrderContext';
import { CartItem } from '../contexts/CartContext';

export interface PaymentResult {
  success: boolean;
  status: 'approved' | 'declined' | 'failed';
  orderNumber?: string;
  message: string;
}

export const processPayment = async (
  customerInfo: CustomerInfo,
  paymentInfo: PaymentInfo,
  cartItem: CartItem
): Promise<PaymentResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const cvv = paymentInfo.cvv;
  let status: 'approved' | 'declined' | 'failed';
  let message: string;

  if (cvv === '111') {
    status = 'approved';
    message = 'Payment processed successfully';
  } else if (cvv === '222') {
    status = 'declined';
    message = 'Payment declined by bank';
  } else if (cvv === '333') {
    status = 'failed';
    message = 'Gateway error occurred';
  } else {
    status = 'approved';
    message = 'Payment processed successfully';
  }

  const orderNumber = generateOrderNumber();

  if (status === 'approved') {
    await updateProductInventory(cartItem.id, cartItem.quantity);
  }

  return {
    success: status === 'approved',
    status,
    orderNumber: status === 'approved' ? orderNumber : undefined,
    message
  };
};

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

const updateProductInventory = async (productId: string, quantity: number): Promise<void> => {
  console.log(`Updating inventory for product ${productId}, reducing by ${quantity}`);
};
