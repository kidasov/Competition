import Sequelize from 'sequelize';
import { sequelize } from '../db';
import { Attendee } from './attendee';
import { UploadId } from './upload';
import UserModel, { UserId } from './user';

interface EventId extends Number {
  _eventIdBrand: string;
}

function asEventId(rawId: number): EventId {
  return rawId as any;
}

enum PublishState {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

enum EventType {
  Single = 'single',
  Pair = 'pair',
}

enum EventProgressState {
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Finished = 'finished',
}

enum EventRegistationState {
  Opened = 'opened',
  Closed = 'closed',
}

interface Event {
  id: EventId;
  name: string;
  createdAt: Date;
  startsAt: Date | null;
  endsAt: Date | null;
  endsRegAt: Date | null;
  ownerUserId: UserId;
  location: string;
  description: string;
  attendees: Attendee[];
  state: PublishState;
  coverMediaId: UploadId | null;
  type: EventType;
  progressState: EventProgressState;
  registrationState: EventRegistationState;
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
  endsRegAt: Sequelize.DATE,
  ownerUserId: Sequelize.INTEGER,
  location: Sequelize.STRING,
  description: Sequelize.STRING,
  attendees: Sequelize.VIRTUAL,
  state: Sequelize.ENUM(PublishState.Draft, PublishState.Published, PublishState.Archived),
  coverMediaId: Sequelize.INTEGER,
  type: Sequelize.ENUM(EventType.Single, EventType.Pair),
  progressState: Sequelize.ENUM(EventProgressState.Upcoming, EventProgressState.Ongoing, EventProgressState.Finished),
  registrationState: Sequelize.ENUM(EventRegistationState.Opened, EventRegistationState.Closed),
});

EventModel.belongsTo(UserModel, { foreignKey: 'ownerUserId', as: 'owner' });

export default EventModel;
export {
  EventId,
  asEventId,
  PublishState,
  EventModel,
  EventAttributes,
  EventInstance,
  Event,
  EventType,
  EventProgressState,
  EventRegistationState,
};
