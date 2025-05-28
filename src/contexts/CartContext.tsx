
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  variants: {
    color: string[];
    size: string[];
  };
  inventory: number;
}

interface CartItem extends Product {
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  cartItem: CartItem | null;
  setCartItem: (item: CartItem | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  const clearCart = () => {
    setCartItem(null);
  };

  return (
    <CartContext.Provider value={{ cartItem, setCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export type { Product, CartItem };
