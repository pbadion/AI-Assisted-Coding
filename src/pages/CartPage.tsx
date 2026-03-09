import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { EmptyState, OrderSummary } from '../components/shared';
import CartItem from '../components/Cart/CartItem';
import './CartPage.css';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartContext();

  if (cart.items.length === 0) {
    return <EmptyState heading="Your Cart" />;
  }

  return (
    <main className="container">
      <div className="cart-page">
        <div className="cart-page-header">
          <h1>Your Cart</h1>
          <button className="btn-secondary" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-page-content">
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <OrderSummary cart={cart}>
            <button
              className="btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </OrderSummary>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
