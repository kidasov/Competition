import { sequelize } from '../db';
import { DataTypes } from 'sequelize';
import User from './user';
import Event from './event';

export const JOIN_REQUEST = 'join_request';
export const INVITED = 'invited';
export const APPROVED = 'approved';

export const OWNER = 'owner';
export const PARTICIPANT = 'participant';
export const WATCHER = 'watcher';
export const JUDGE = 'judge';

const Attendee = sequelize.define('attendee', {
  status: DataTypes.ENUM([JOIN_REQUEST, INVITED, APPROVED]),
  role: DataTypes.ENUM([OWNER, PARTICIPANT, WATCHER, JUDGE]),
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('now'),
  },
});

Event.belongsToMany(User, { through: Attendee });
User.belongsToMany(Event, { through: Attendee });
Attendee.belongsTo(User);
export default Attendee;
