import { EventsPage } from './events-page/events-page.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { Routes } from '@angular/router';
import { UsersPage } from './users-page/users-page.component';

export const routes: Routes = [
  { path: 'events', component: EventsPage },
  { path: 'events/new', component: EventCreateComponent },
  { path: 'users', component: UsersPage },
  { path: '', component: EventsPage },
];
