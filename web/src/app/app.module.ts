import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes/routes';
import { EventsComponent } from './components/events/events.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventsPage } from './routes/events-page/events-page.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UsersPage } from './routes/users-page/users-page.component';
import { HeaderComponent } from './components/header/header.component';
import { InputComponent } from './components/inputs/input/input.component';
import { AddUserFormComponent } from './routes/users-page/components/add-user-form/add-user-form.component';
import { UsersTableComponent } from './routes/users-page/components/users-table/users-table.component';
import { ButtonComponent } from './components/button/button.component';
import { CloseComponent } from './components/icons/close/close.component';
import { EditUserFormComponent } from './routes/users-page/components/edit-user-form/edit-user-form.component';
import { EventsTableComponent } from './routes/events-page/components/events-table/events-table.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SubmitComponent } from './components/inputs/submit/submit.component';
import { EventPageComponent } from './routes/event-page/event-page.component';
import { AttendeesTableComponent } from './routes/event-page/components/attendees-table/attendees-table.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { PopupComponent } from './components/popup/popup.component';
import { SwitchComponent } from './components/switch/switch.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventsPage,
    DropdownMenuComponent,
    SidebarComponent,
    UsersPage,
    HeaderComponent,
    InputComponent,
    AddUserFormComponent,
    UsersTableComponent,
    ButtonComponent,
    CloseComponent,
    EditUserFormComponent,
    EventsTableComponent,
    LoginFormComponent,
    SubmitComponent,
    EventPageComponent,
    AttendeesTableComponent,
    IconButtonComponent,
    PopupComponent,
    SwitchComponent,
  ],
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true }),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
