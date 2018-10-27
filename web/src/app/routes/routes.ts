import { Routes } from '@angular/router';
import { AuthVkComponent } from 'app/auth-vk/auth-vk.component';
import { EventPageComponent } from './event-page/event-page.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UsersPageComponent } from './users-page/users-page.component';

export const routes: Routes = [
  { path: 'events', component: EventsPageComponent },
  { path: 'events/:eventId', component: EventPageComponent },
  { path: 'users', component: UsersPageComponent },
  { path: 'users/:userId', component: UserPageComponent },
  { path: 'auth/vk', component: AuthVkComponent },
  { path: '', component: EventsPageComponent },
];
