import { Id } from 'app/types/types';
import { User } from './user';

export class EventData {
  name: string;
  startsAt?: Date;
  endsAt?: Date;
  ownerUserId: Id;
  location: string;
  description: string;
  coverMediaId: Id;
  state: PublishState;
  type: EventType;
}

export enum PublishState {
  Draft = 'draft',
  Published = 'published',
}

export enum EventType {
  Single = 'single',
  Pair = 'pair',
}

export class Event extends EventData {
  id: Id;
  createdAt: Date;
}

export interface Attendee {
  eventId: Id;
  userId: Id;
  status: 'join_request' | 'invited' | 'approved';
  role: 'owner' | 'participant' | 'watcher' | 'judge';
  joinedAt: Date;
  user: User;
  pairedUserId: Id | null;
}

export interface EventWithUsers extends Event {
  users: User[];
}

export class DetailedEvent extends Event {
  attendees: Attendee[];
}
