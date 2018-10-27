import * as Sequelize from 'sequelize';
import { sequelize } from '../db';

interface UserId extends Number {
  _userIdBrand: string;
}

function asUserId(rawId: number): UserId {
  return rawId as any;
}

interface User {
  id: UserId;
  firstName: string;
  lastName: string;
  email: string | null;
  rating: number | null;
  password: string | null;
  ttwId: string | null;
  createdAt: string;
}

type UserAttributes = Partial<User>;

type UserInstance = Sequelize.Instance<UserAttributes> & User;

const UserModel = sequelize.define<UserInstance, UserAttributes>('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  rating: Sequelize.REAL,
  password: Sequelize.STRING,
  ttwId: Sequelize.STRING,
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: sequelize.fn('now'),
  },
});

export default UserModel;
export { UserId, asUserId, UserAttributes, UserInstance, UserModel };
