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

export default interface Attendee {
  eventId: number;
  userId: number;
  status: AttendeeStatus;
  role: AttendeeRole;
  joinedAt: string;
  pairedUserId: number | null;

  event?: Event;
}
