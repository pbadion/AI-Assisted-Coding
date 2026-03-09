/**
 * Unit tests for SearchBar – value, onChange, clear, placeholder, boundaries
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders with value and placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Search pies..." />);
    const input = screen.getByRole('textbox', { name: /search pies/i });
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('placeholder', 'Search pies...');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /search pies/i });
    await user.type(input, 'apple');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows clear button when value is non-empty', () => {
    render(<SearchBar value="apple" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  it('clear button calls onChange with empty string', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="apple" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /clear search/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('uses default placeholder when not provided', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Search pies...')).toBeInTheDocument();
  });
});
