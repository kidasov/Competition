import Sequelize from 'sequelize';
import { sequelize } from '../db';
import EventModel, { EventId } from './event';
import { UserId, UserModel } from './user';

enum NotificationType {
  Invitation = 'event_invite',
  PairInvitation = 'pair_invite',
}

interface Notification {
  id: number;
  userId: UserId;
  eventId: EventId;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
  sentBy: UserId;
}

type NotificationAttributes = Partial<Notification>;

type NotificationInstance = Sequelize.Instance<NotificationAttributes> &
  Notification;

const NotificationModel = sequelize.define<
  NotificationInstance,
  NotificationAttributes
>('notification', {
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: sequelize.fn('now'),
  },
  userId: Sequelize.INTEGER,
  eventId: Sequelize.INTEGER,
  type: Sequelize.ENUM(
    NotificationType.Invitation,
    NotificationType.PairInvitation,
  ),
  sentBy: Sequelize.INTEGER,
});

NotificationModel.belongsTo(UserModel, { as: 'sentByUser', foreignKey: 'sentBy' });
NotificationModel.belongsTo(EventModel);

export default NotificationModel;
export {
  NotificationType,
  Notification,
  NotificationAttributes,
  NotificationInstance,
};
