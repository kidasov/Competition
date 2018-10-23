import { EventsPage } from './events-page/events-page.component';
import { Routes } from '@angular/router';
import { UsersPage } from './users-page/users-page.component';
import { EventPageComponent } from './event-page/event-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AuthVkComponent } from 'app/auth-vk/auth-vk.component';

export const routes: Routes = [
  { path: 'events', component: EventsPage },
  { path: 'events/:eventId', component: EventPageComponent },
  { path: 'users', component: UsersPage },
  { path: 'users/:userId', component: UserPageComponent },
  { path: 'auth/vk', component: AuthVkComponent },
  { path: '', component: EventsPage },
];
