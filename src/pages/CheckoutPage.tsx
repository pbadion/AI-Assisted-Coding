/**
 * CheckoutPage Component - Checkout form with shipping information
 * Includes form validation and order submission
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import './CheckoutPage.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartContext();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate order number (format: ORD-XXXXXX with timestamp for uniqueness)
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `ORD-${timestamp}-${random}`;

      // Navigate to success page with order number
      navigate('/checkout-success', { state: { orderNumber } });
    } catch (error) {
      console.error('Error processing order:', error);
      setIsSubmitting(false);
      // In a real app, you'd show an error message to the user
      alert('There was an error processing your order. Please try again.');
    }
  };

  if (cart.items.length === 0) {
    return (
      <main className="container">
        <div className="checkout-empty">
          <h1>Checkout</h1>
          <div className="empty-checkout-content">
            <h2>Your cart is empty</h2>
            <p>Add some delicious pies to your cart before checking out!</p>
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="checkout-page">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2>Shipping Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john.doe@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Shipping Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="123 Main Street, City, State, ZIP Code"
                  rows={4}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <button
                type="submit"
                className="btn-primary submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-quantity">x{item.quantity}</span>
                  <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-summary-row">
              <span>Items ({cart.totalQuantity}):</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="order-summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="order-summary-row total">
              <span>Total:</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;

