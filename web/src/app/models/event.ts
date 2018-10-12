import { RouterLink } from '@angular/router';
import { Id } from 'app/types/types';

export class EventData {
  name: string;
  startsAt?: Date;
  endsAt?: Date;
  ownerUserId: Id;
  location: string;
  description: string;
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
}

export class DetailedEvent extends Event {
  attendees: Attendee[];
}
