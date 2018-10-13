import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

export const DRAFT = 'draft';
export const PUBLISHED = 'published';

const Event = sequelize.define('event', {
  name: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('now'),
  },
  startsAt: DataTypes.DATE,
  endsAt: DataTypes.DATE,
  ownerUserId: DataTypes.INTEGER,
  location: DataTypes.STRING,
  description: DataTypes.STRING,
  attendees: DataTypes.VIRTUAL,
  state: DataTypes.ENUM(DRAFT, PUBLISHED),
});

export default Event;
