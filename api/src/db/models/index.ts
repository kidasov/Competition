import { sequelize } from '../db';
import Attendee from './attendee';
import Event from './event';
import Session from './session';
import User from './user';

export { Event, User, Session, Attendee };

sequelize.sync({ force: false });
