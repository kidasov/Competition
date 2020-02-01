import { Id } from 'app/types/types';
import { Attendee } from './attendee';
import { User } from './user';

export class EventData {
  name: string;
  startsAt?: Date;
  endsAt?: Date;
  endsRegAt?: Date;
  ownerUserId: Id;
  owner: User;
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

export interface EventWithUsers extends Event {
  users: User[];
}

export class DetailedEvent extends Event {
  attendees: Attendee[];

  constructor(event: EventData) {
    super();
    Object.assign(this, event);
  }
}
