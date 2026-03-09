/**
 * Unit tests for PieCard – render, add to cart, edge cases (missing image/description)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PieCard from './PieCard';
import type { Pie } from '../../types/pie';

const defaultPie: Pie = {
  id: '1',
  name: 'Apple Pie',
  price: 12.99,
  description: 'Classic apple pie',
  category: 'fruit',
  image: '/img/apple.jpg',
};

describe('PieCard', () => {
  it('renders pie name, description, price and Add to Cart button', () => {
    const onAddToCart = vi.fn();
    render(<PieCard pie={defaultPie} onAddToCart={onAddToCart} />);
    expect(screen.getByText('Apple Pie')).toBeInTheDocument();
    expect(screen.getByText('Classic apple pie')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Apple Pie to cart/i })).toBeInTheDocument();
  });

  it('calls onAddToCart with pie when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(<PieCard pie={defaultPie} onAddToCart={onAddToCart} />);
    await user.click(screen.getByRole('button', { name: /Add Apple Pie to cart/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(defaultPie);
  });

  it('uses placeholder image when image is empty', () => {
    const pieNoImage = { ...defaultPie, image: '' };
    render(<PieCard pie={pieNoImage} onAddToCart={vi.fn()} />);
    const img = screen.getByRole('img', { name: 'Apple Pie' });
    expect(img).toHaveAttribute('src', '/images/placeholder.png');
  });

  it('renders empty description as empty string', () => {
    const pieNoDesc = { ...defaultPie, description: '' };
    const { container } = render(<PieCard pie={pieNoDesc} onAddToCart={vi.fn()} />);
    const desc = container.querySelector('.pie-description');
    expect(desc).toHaveTextContent('');
  });

  it('formats price to two decimals', () => {
    const pie = { ...defaultPie, price: 10 };
    render(<PieCard pie={pie} onAddToCart={vi.fn()} />);
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });
});
