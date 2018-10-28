import Sequelize from 'sequelize';
import { sequelize } from '../db';
import { UserId } from './user';

interface SessionId extends String {
  _sessionIdBrand: string;
}

function asSessionId(rawId: string): SessionId {
  return rawId as any;
}

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
export {
  SessionId,
  asSessionId,
  SessionAttributes,
  SessionInstance,
  SessionModel,
};
