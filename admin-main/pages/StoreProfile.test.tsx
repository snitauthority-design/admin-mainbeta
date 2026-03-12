import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import StoreProfile from './StoreProfile';
import type { Order, User } from '../types';

vi.mock('../components/StoreHeader', () => ({
  StoreHeader: () => <div data-testid="store-header" />,
}));

vi.mock('../components/store/StoreFooter', () => ({
  StoreFooter: () => <div data-testid="store-footer" />,
}));

vi.mock('../components/store/TrackOrderModal', () => ({
  TrackOrderModal: () => <div data-testid="track-order-modal" />,
}));

const makeUser = (overrides: Partial<User> = {}): User => ({
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '01700000000',
  address: 'Dhaka',
  ...overrides,
});

const makeOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'ORD-1001',
  customer: 'Jane Doe',
  email: 'jane@example.com',
  location: 'Dhaka',
  amount: 1200,
  date: '2026-03-01',
  status: 'Pending',
  customerPhone: '01700000000',
  grandTotal: 1200,
  total: 1200,
  createdAt: '2026-03-01',
  items: [],
  weight: 0,
  pathaoArea: 0,
  pathaoZone: 0,
  pathaoCity: 0,
  sku: 'SKU-1',
  productImage: null,
  ...overrides,
});

describe('StoreProfile', () => {
  test('updates personal info from edit form', async () => {
    const user = userEvent.setup();
    const onUpdateProfile = vi.fn();

    render(
      <StoreProfile
        user={makeUser()}
        orders={[makeOrder()]}
        onUpdateProfile={onUpdateProfile}
        onHome={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit details/i }));
    const fullNameInput = screen.getByDisplayValue('Jane Doe');
    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Janet Doe');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Janet Doe' })
    );
    expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
  });

  test('shows order history when orders tab is selected', async () => {
    const user = userEvent.setup();

    render(
      <StoreProfile
        user={makeUser()}
        orders={[makeOrder({ id: 'ORD-2002', status: 'Shipped' })]}
        onUpdateProfile={vi.fn()}
        onHome={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /my orders/i }));

    expect(screen.getByRole('heading', { name: /order history/i })).toBeInTheDocument();
    expect(screen.getByText('ORD-2002')).toBeInTheDocument();
    expect(screen.getByText(/on the way/i)).toBeInTheDocument();
  });
});
