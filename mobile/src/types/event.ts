import Attendee from './attendee';
export default interface Event {
  name: string;
  startsAt?: Date;
  endsAt?: Date;
  ownerUserId: number;
  location: string;
  description: string;
  attendee: Attendee[];
  coverMediaId: number;
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
