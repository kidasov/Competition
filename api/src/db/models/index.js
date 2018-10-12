import { sequelize } from '../db';
import Event from './event';
import User from './user';
import Session from './session';
import Attendee from './attendee';

export { Event, User, Session, Attendee };

sequelize.sync({ force: false });
