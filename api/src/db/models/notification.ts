import Sequelize from 'sequelize';
import { sequelize } from '../db';
import EventModel, { EventId } from './event';
import { UserId, UserModel } from './user';

enum NotificationType {
  Invitation = 'event_invite',
  PairInvitation = 'pair_invite',
  RejectInvitation = 'reject_invite',
  AcceptJoin = 'accept_join',
  DeclineJoin = 'decline_join',
  Remove = 'removed',
  RequestJoin = 'request_join',
}

interface Notification {
  id: number;
  createdAt: Date;
  userId: UserId;
  type: NotificationType;
  sentBy: UserId;
  eventId: EventId;
  read: boolean;
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
  type: Sequelize.ENUM(
    NotificationType.Invitation,
    NotificationType.PairInvitation,
    NotificationType.RejectInvitation,
    NotificationType.AcceptJoin,
    NotificationType.DeclineJoin,
    NotificationType.Remove,
    NotificationType.RequestJoin,
  ),
  sentBy: Sequelize.INTEGER,
  eventId: Sequelize.INTEGER,
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
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
