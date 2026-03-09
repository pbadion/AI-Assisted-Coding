/**
 * CheckoutSuccessPage Component - Order confirmation page
 * Displays order number after successful checkout
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import './CheckoutSuccessPage.css';

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCartContext();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber;

  useEffect(() => {
    // Clear cart on successful checkout (only if cart has items)
    if (orderNumber && cart.items.length > 0) {
      clearCart();
    }
  }, [orderNumber, cart.items.length, clearCart]);

  // Redirect if no order number (direct access)
  useEffect(() => {
    if (!orderNumber) {
      navigate('/cart');
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  return (
    <main className="container">
      <div className="checkout-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p className="success-message">
            Thank you for your order. We've received your order and will begin processing it shortly.
          </p>
          <div className="order-number-container">
            <p className="order-label">Your Order Number:</p>
            <p className="order-number">{orderNumber}</p>
          </div>
          <p className="order-info">
            You will receive an email confirmation shortly with your order details.
          </p>
          <div className="success-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;

