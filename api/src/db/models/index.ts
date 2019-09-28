import { sequelize } from '../db';
import Attendee from './attendee';
import Event from './event';
import Notification from './notification';
import Session from './session';
import Upload from './upload';
import User from './user';

export { Event, User, Session, Attendee, Upload, Notification };

sequelize.sync({ force: false });
