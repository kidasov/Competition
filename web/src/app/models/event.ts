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
  progressState: EventProgressState;
  registrationState: EventRegistationState;
}

export enum PublishState {
  Draft = 'draft',
  Published = 'published',
}

export enum EventType {
  Single = 'single',
  Pair = 'pair',
}

export enum EventProgressState {
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Finished = 'finished',
}

export enum EventRegistationState {
  Closed = 'closed',
  Opened = 'opened',
}
export class Event extends EventData {
  id: Id;
  createdAt: Date;
  get isUpcoming() {
    return this.progressState === EventProgressState.Upcoming;
  }

  get isOngoing() {
    return this.progressState === EventProgressState.Ongoing;
  }

  get isFinished() {
    return this.progressState === EventProgressState.Finished;
  }

  get isRegistrationOpened() {
    return this.registrationState === EventRegistationState
    .Opened;
  }

  get isRegistrationClosed() {
    return this.registrationState === EventRegistationState.Closed;
  }

  get isPublished() {
    return this.state === PublishState.Published;
  }

  get isDraft() {
    return this.state === PublishState.Draft;
  }
}

export class EventWithUsers extends Event {
  users: User[];
  
  constructor(event: EventData) {
    super();
    Object.assign(this, event);
  }
}

export class DetailedEvent extends Event {
  attendees: Attendee[];

  constructor(event: EventData) {
    super();
    Object.assign(this, event);
  }
}
