
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
  productInfo: any;
  status: 'approved' | 'declined' | 'failed';
  total: number;
  createdAt: string;
}

interface OrderContextType {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    setCurrentOrder(order);
  };

  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder, orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export type { CustomerInfo, PaymentInfo, Order };
