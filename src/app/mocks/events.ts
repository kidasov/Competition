import { Event } from '../models/event';

export var events: Event[] = [
    {
        id: 1, name: "Event 1", createdAt: new Date("2018-06-25T19:12:00.330Z"),
        ownerUserId: 1, location: "Samara", description: "Table tennis competitions"
    },
    {
        id: 2, name: "Event 2", createdAt: new Date("2018-06-28T21:34:00.330Z"),
        ownerUserId: 2, location: "Ufa", description: "Best table cup"
    }
];