import * as Sequelize from 'sequelize';
import { sequelize } from '../db';
import { Attendee } from './attendee';
import { UserId } from './user';

type EventId = number;

enum PublishState {
  Draft = 'draft',
  Published = 'published',
}

interface Event {
  id: EventId;
  name: string;
  createdAt: string;
  startsAt: string;
  endsAt: string;
  ownerUserId: UserId;
  location: string;
  description: string;
  attendees: Attendee[];
  state: PublishState;
}

type EventAttributes = Partial<Event>;

type EventInstance = Sequelize.Instance<EventAttributes> & Event;

const EventModel = sequelize.define<EventInstance, EventAttributes>('event', {
  name: Sequelize.STRING,
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: sequelize.fn('now'),
  },
  startsAt: Sequelize.DATE,
  endsAt: Sequelize.DATE,
  ownerUserId: Sequelize.INTEGER,
  location: Sequelize.STRING,
  description: Sequelize.STRING,
  attendees: Sequelize.VIRTUAL,
  state: Sequelize.ENUM(PublishState.Draft, PublishState.Published),
});

export default EventModel;
export {
  EventId,
  PublishState,
  EventModel,
  EventAttributes,
  EventInstance,
  Event,
};
