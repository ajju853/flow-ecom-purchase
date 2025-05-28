
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { productService } from '../services/api';

const LandingPage = () => {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productService.getProduct('prod-001');
        const productData = response.data;
        setProduct(productData);
        setSelectedColor(productData.variants.color[0]);
        setSelectedSize(productData.variants.size[0]);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, []);

  const handleBuyNow = () => {
    if (!product || !selectedColor || !selectedSize) {
      setError('Please select all options');
      return;
    }

    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
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
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '500px',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
          />
        </div>

        <div className="card">
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-success">In Stock ({product.inventory})</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            {product.name}
          </h1>
          
          <p style={{ color: '#6b7280', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
            {product.description}
          </p>

          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb', marginBottom: '32px' }}>
            ${product.price.toFixed(2)}
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="form-input"
            >
              {product.variants.color.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="form-input"
            >
              {product.variants.size.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            className="btn"
            style={{ width: '100%', fontSize: '18px', padding: '16px' }}
          >
            Buy Now - ${(product.price * quantity).toFixed(2)}
          </button>

          {error && (
            <div className="form-error" style={{ marginTop: '12px', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
