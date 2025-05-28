
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null);

  const addToCart = (product, selectedColor, selectedSize, quantity) => {
    setCartItem({
      ...product,
      selectedColor,
      selectedSize,
      quantity
    });
  };

  const clearCart = () => {
    setCartItem(null);
  };

  const value = {
    cartItem,
    addToCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
