import { User } from './user';

enum AttendeeStatus {
  JoinRequest = 'join_request',
  Invited = 'invited',
  Approved = 'approved',
}

enum AttendeeRole {
  Owner = 'owner',
  Participant = 'participant',
  Watcher = 'watcher',
  Judge = 'judge',
}


export class Attendee {
  role: AttendeeRole;
  eventId: number;
  pairedUserId: number | null;
  status: AttendeeStatus;
  createdAt: Date;
  joinedAt: Date;
  updatedAt: Date;
  user: User;
  userId: number;

  constructor(attendee: Attendee) {
    Object.assign(this, attendee);
    this.user = new User(attendee.user);
  }

  get name() {
    return this.user.name;
  }

  get rating() {
    return this.user.rating;
  }
}
