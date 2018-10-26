import * as Sequelize from 'sequelize';
import { sequelize } from '../db';
import { UserId } from './user';

type SessionId = string;

interface Session {
  id: SessionId;
  createdAt: string;
  userId: UserId;
}

type SessionAttributes = Partial<Session>;

type SessionInstance = Sequelize.Instance<SessionAttributes> & Session;

const SessionModel = sequelize.define<SessionInstance, SessionAttributes>(
  'session',
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('now'),
    },
    userId: Sequelize.INTEGER,
  },
);

export default SessionModel;
export { SessionId, SessionAttributes, SessionInstance, SessionModel };
