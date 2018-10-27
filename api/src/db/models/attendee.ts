import * as Sequelize from 'sequelize';
import { sequelize } from '../db';
import { EventId, EventInstance, EventModel } from './event';
import { UserId, UserModel } from './user';

enum AttendeeStatus {
  JoinRequest = 'join_request',
  Invited = 'invited',
  Approved = 'approved',
}

enum AttendeeRole {
  Owner = 'owner',
  Participant = 'participant',
  Watcher = 'watcher',
  Judge = 'judge',
}

interface Attendee {
  eventId: EventId;
  userId: UserId;
  status: AttendeeStatus;
  role: AttendeeRole;
  joinedAt: string;
  event?: Event;
}

type AttendeeAttributes = Partial<Attendee>;

type AttendeeInstance = Sequelize.Instance<AttendeeAttributes> &
  Attendee & {
    event?: EventInstance;
  };

const AttendeeModel = sequelize.define<AttendeeInstance, AttendeeAttributes>(
  'attendee',
  {
    status: Sequelize.ENUM(
      AttendeeStatus.JoinRequest,
      AttendeeStatus.Invited,
      AttendeeStatus.Approved,
    ),
    role: Sequelize.ENUM(
      AttendeeRole.Owner,
      AttendeeRole.Participant,
      AttendeeRole.Watcher,
      AttendeeRole.Judge,
    ),
    joinedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('now'),
    },
  },
);

EventModel.belongsToMany(UserModel, { through: AttendeeModel });
UserModel.belongsToMany(EventModel, { through: AttendeeModel });
AttendeeModel.belongsTo(UserModel);
AttendeeModel.belongsTo(EventModel);

export default AttendeeModel;
export {
  AttendeeStatus,
  AttendeeRole,
  AttendeeModel,
  AttendeeAttributes,
  AttendeeInstance,
  Attendee,
};
