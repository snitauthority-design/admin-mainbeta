import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardLayout from './DashboardLayout';

vi.mock('./DashboardSidebar', () => ({
  DashboardSidebar: () => <div>Sidebar</div>,
}));

vi.mock('./FigmaDashboardHeader', () => ({
  default: () => <div>Header</div>,
}));

describe('DashboardLayout mobile sidebar behavior', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    document.body.style.overflow = '';
  });

  test('locks and unlocks body scroll when mobile sidebar opens and closes', async () => {
    const user = userEvent.setup();

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    await user.click(screen.getByRole('button', { name: /open sidebar/i }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: /close sidebar/i }));
    expect(document.body.style.overflow).toBe('');
  });

  test('closes sidebar on escape key press', async () => {
    const user = userEvent.setup();

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    await user.click(screen.getByRole('button', { name: /open sidebar/i }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.body.style.overflow).toBe('');
  });
});
