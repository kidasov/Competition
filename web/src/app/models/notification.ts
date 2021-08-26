import { User } from './user';

export enum NotificationType {
  Invitation = 'event_invite',
  PairInvitation = 'pair_invite',
  RejectInvitation = 'reject_invite',
  AcceptJoin = 'accept_join',
  DeclineJoin = 'decline_join',
  Remove = 'removed',
}

export class Notification {
  id: number;
  eventId: number;
  createdAt: Date;
  userId: number;
  sentBy: number;
  type: NotificationType;
  read: boolean;
  sentByUser: User;
  event: Event;
}
