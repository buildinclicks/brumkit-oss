import { describe, it, expect, vi } from 'vitest';

import { renderWithProviders, screen, userEvent } from '@/lib/test';

import { NotificationItem } from './notification-item';

import type { Notification } from '@prisma/client';

describe('NotificationItem', () => {
  const mockNotification: Notification = {
    id: '1',
    type: 'SYSTEM',
    title: 'Test Notification',
    message: 'This is a test message',
    link: '/test',
    readAt: null,
    createdAt: new Date(),
    recipientId: 'user1',
  };

  it('should render notification title and message', () => {
    renderWithProviders(
      <NotificationItem
        notification={mockNotification}
        onMarkAsRead={() => {}}
      />,
      { disableTheme: true }
    );

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('should show unread indicator for unread notifications', () => {
    renderWithProviders(
      <NotificationItem
        notification={mockNotification}
        onMarkAsRead={() => {}}
      />,
      { disableTheme: true }
    );

    expect(screen.getByTestId('unread-indicator')).toBeInTheDocument();
  });

  it('should not show unread indicator for read notifications', () => {
    const readNotification = { ...mockNotification, readAt: new Date() };

    renderWithProviders(
      <NotificationItem
        notification={readNotification}
        onMarkAsRead={() => {}}
      />,
      { disableTheme: true }
    );

    expect(screen.queryByTestId('unread-indicator')).not.toBeInTheDocument();
  });

  it('should call onMarkAsRead when mark as read button clicked', async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();

    renderWithProviders(
      <NotificationItem
        notification={mockNotification}
        onMarkAsRead={onMarkAsRead}
      />,
      { disableTheme: true }
    );

    await user.click(screen.getByRole('button', { name: /mark as read/i }));

    expect(onMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('should not show mark as read button for read notifications', () => {
    const readNotification = { ...mockNotification, readAt: new Date() };

    renderWithProviders(
      <NotificationItem
        notification={readNotification}
        onMarkAsRead={() => {}}
      />,
      { disableTheme: true }
    );

    expect(
      screen.queryByRole('button', { name: /mark as read/i })
    ).not.toBeInTheDocument();
  });
});
