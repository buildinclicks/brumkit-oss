import { describe, it, expect } from 'vitest';

import {
  defineAbilitiesFor,
  createAbility,
  subject,
} from '../src/permissions/abilities';

import type { UserContext } from '../src/permissions/abilities';

describe('CASL Abilities', () => {
  const superAdmin: UserContext = {
    id: '1',
    role: 'SUPER_ADMIN',
    email: 'superadmin@test.com',
  };

  const admin: UserContext = {
    id: '2',
    role: 'ADMIN',
    email: 'admin@test.com',
  };

  const moderator: UserContext = {
    id: '3',
    role: 'MODERATOR',
    email: 'moderator@test.com',
  };

  const user: UserContext = {
    id: '4',
    role: 'USER',
    email: 'user@test.com',
  };

  describe('SUPER_ADMIN', () => {
    it('can manage all resources', () => {
      const ability = defineAbilitiesFor(superAdmin);

      expect(ability.can('manage', 'all')).toBe(true);
      expect(ability.can('delete', 'User')).toBe(true);
      expect(ability.can('update', 'Notification')).toBe(true);
    });
  });

  describe('ADMIN', () => {
    it('can manage users and notifications', () => {
      const ability = defineAbilitiesFor(admin);

      expect(ability.can('manage', 'User')).toBe(true);
      expect(ability.can('manage', 'Notification')).toBe(true);
    });

    it('can read all resources', () => {
      const ability = defineAbilitiesFor(admin);

      expect(ability.can('read', 'all')).toBe(true);
      expect(ability.can('read', 'User')).toBe(true);
      expect(ability.can('read', 'Notification')).toBe(true);
    });

    it('cannot manage everything (not super admin)', () => {
      const ability = defineAbilitiesFor(admin);

      expect(ability.can('manage', 'all')).toBe(false);
    });
  });

  describe('MODERATOR', () => {
    it('can read all resources', () => {
      const ability = defineAbilitiesFor(moderator);

      expect(ability.can('read', 'all')).toBe(true);
      expect(ability.can('read', 'User')).toBe(true);
      expect(ability.can('read', 'Notification')).toBe(true);
    });

    it('can manage own notifications', () => {
      const ability = defineAbilitiesFor(moderator);
      const ownNotification = subject('Notification', {
        id: 'notif-1',
        recipientId: moderator.id,
        type: 'SYSTEM' as const,
        title: 'Test',
        message: 'Test message',
        link: null,
        readAt: null,
        createdAt: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('update', ownNotification as any)).toBe(true);
    });

    it('cannot manage other users notifications', () => {
      const ability = defineAbilitiesFor(moderator);
      const othersNotification = subject('Notification', {
        id: 'notif-2',
        recipientId: 'other-user-id',
        type: 'SYSTEM' as const,
        title: 'Test',
        message: 'Test message',
        link: null,
        readAt: null,
        createdAt: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('update', othersNotification as any)).toBe(false);
    });

    it('cannot manage users', () => {
      const ability = defineAbilitiesFor(moderator);

      expect(ability.can('manage', 'User')).toBe(false);
      expect(ability.can('create', 'User')).toBe(false);
      expect(ability.can('delete', 'User')).toBe(false);
    });
  });

  describe('USER', () => {
    it('can read users', () => {
      const ability = defineAbilitiesFor(user);

      expect(ability.can('read', 'User')).toBe(true);
    });

    it('can update own user profile', () => {
      const ability = defineAbilitiesFor(user);
      const ownProfile = subject('User', { id: user.id });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('update', ownProfile as any)).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('read', ownProfile as any)).toBe(true);
    });

    it('cannot update other users profile', () => {
      const ability = defineAbilitiesFor(user);
      const othersProfile = subject('User', { id: 'other-user-id' });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('update', othersProfile as any)).toBe(false);
    });

    it('cannot delete any user', () => {
      const ability = defineAbilitiesFor(user);

      expect(ability.can('delete', 'User')).toBe(false);
    });

    it('cannot manage users', () => {
      const ability = defineAbilitiesFor(user);

      expect(ability.can('manage', 'User')).toBe(false);
      expect(ability.can('create', 'User')).toBe(false);
    });

    it('can read own notifications', () => {
      const ability = defineAbilitiesFor(user);
      const ownNotification = subject('Notification', {
        id: 'notif-3',
        recipientId: user.id,
        type: 'SYSTEM' as const,
        title: 'Test',
        message: 'Test message',
        link: null,
        readAt: null,
        createdAt: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('read', ownNotification as any)).toBe(true);
    });

    it('can update own notifications', () => {
      const ability = defineAbilitiesFor(user);
      const ownNotification = subject('Notification', {
        id: 'notif-4',
        recipientId: user.id,
        type: 'SYSTEM' as const,
        title: 'Test',
        message: 'Test message',
        link: null,
        readAt: null,
        createdAt: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('update', ownNotification as any)).toBe(true);
    });

    it('cannot read other users notifications', () => {
      const ability = defineAbilitiesFor(user);
      const othersNotification = subject('Notification', {
        id: 'notif-5',
        recipientId: 'other-user-id',
        type: 'SYSTEM' as const,
        title: 'Test',
        message: 'Test message',
        link: null,
        readAt: null,
        createdAt: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('read', othersNotification as any)).toBe(false);
    });

    it('cannot update other users notifications', () => {
      const ability = defineAbilitiesFor(user);
      const othersNotification = subject('Notification', {
        id: 'notif-6',
        recipientId: 'other-user-id',
        type: 'SYSTEM' as const,
        title: 'Test',
        message: 'Test message',
        link: null,
        readAt: null,
        createdAt: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(ability.can('update', othersNotification as any)).toBe(false);
    });
  });

  describe('createAbility', () => {
    it('should create an ability instance', () => {
      const ability = createAbility(user);

      expect(ability).toBeDefined();
      expect(ability.can('read', 'User')).toBe(true);
    });
  });
});
