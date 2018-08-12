export class EventData {
    name: string;
    startsAt?: Date;
    endsAt?: Date;
    ownerUserId: number;
    location: string;
    description: string;
}

export class Event extends EventData {
    id: number;
    createdAt: Date;
}