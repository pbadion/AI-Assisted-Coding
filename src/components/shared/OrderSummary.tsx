import React from 'react';
import { Cart } from '../../types/pie';

interface OrderSummaryProps {
  cart: Cart;
  showItemDetails?: boolean;
  children?: React.ReactNode;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  showItemDetails = false,
  children,
}) => (
  <div className="order-summary-card">
    {showItemDetails && (
      <div className="order-items">
        {cart.items.map((item) => (
          <div key={item.id} className="order-item">
            <span className="order-item-name">{item.name}</span>
            <span className="order-item-quantity">x{item.quantity}</span>
            <span className="order-item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    )}
    <div className="summary-row">
      <span>Items ({cart.totalQuantity}):</span>
      <span>${cart.totalPrice.toFixed(2)}</span>
    </div>
    <div className="summary-row">
      <span>Shipping:</span>
      <span>Free</span>
    </div>
    <div className="summary-row total">
      <span>Total:</span>
      <span>${cart.totalPrice.toFixed(2)}</span>
    </div>
    {children}
  </div>
);

export default OrderSummary;
