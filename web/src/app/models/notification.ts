import { User } from './user';

export enum NotificationType {
  Invitation = 'event_invite',
  PairInvitation = 'pair_invite',
}

export class Notification {
  eventId: number;
  createdAt: Date;
  userId: number;
  sentBy: number;
  type: NotificationType;
  read: boolean;
  sentByUser: User;
  event: Event;
}
