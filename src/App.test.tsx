/**
 * Unit tests for App – routing, CartProvider, main routes
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockFetch = vi.fn();

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    mockFetch.mockImplementation((url: string) => {
      if (typeof url === 'string' && (url.includes('/api/pies') || url.includes('/api/pies-of-the-month'))) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders app with header', async () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Pies of the Month')).toBeInTheDocument();
    });
  });

  it('renders home at /', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Pies of the Month')).toBeInTheDocument();
    });
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
  });

  it('navigates to cart page when cart link is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Pies of the Month')).toBeInTheDocument();
    });
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    expect(screen.getAllByRole('heading', { name: /your cart/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders checkout route at /checkout', async () => {
    window.history.pushState({}, '', '/checkout');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    });
  });

  it('renders category route for /:category', async () => {
    window.history.pushState({}, '', '/fruit');
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Fruit Pies/i)).toBeInTheDocument();
    });
  });
});
