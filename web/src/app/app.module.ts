import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DpDatePickerModule } from "ng2-date-picker";
import { ImageCropperComponent } from 'ngx-img-cropper';

import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { AuthVkComponent } from './auth-vk/auth-vk.component';
import { AddEventButtonComponent } from './components/add-event-button/add-event-button.component';
import { ButtonComponent } from './components/button/button.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { EditEventButtonComponent } from './components/edit-event-button/edit-event-button.component';
import { EditUserButtonComponent } from './components/edit-user-button/edit-user-button.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventsTableComponent } from './components/events-table/events-table.component';
import { EventsComponent } from './components/events/events.component';
import { HeaderComponent } from './components/header/header.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { CloseComponent } from './components/icons/close/close.component';
import { InputComponent } from './components/inputs/input/input.component';
import { SubmitComponent } from './components/inputs/submit/submit.component';
import { InviteUserButtonComponent } from './components/invite-user-button/invite-user-button.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PopupComponent } from './components/popup/popup.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
// tslint:disable-next-line:max-line-length
import { RemoveAllNotificationsButtonComponent } from './components/remove-all-notifications-button/remove-all-notifications-button.component';
import { SearchEventButtonComponent } from './components/search-event-button/search-event-button.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SwitchComponent } from './components/switch/switch.component';
import { UploadImageButtonComponent } from './components/upload-image-button/upload-image-button.component';
import { AttendeeTableComponent } from './routes/event-page/components/attendee-table/attendee-table.component';
import { AttendeesTableComponent } from './routes/event-page/components/attendees-table/attendees-table.component';
import { EventPageComponent } from './routes/event-page/event-page.component';
import { EventsPageComponent } from './routes/events-page/events-page.component';
import { MyEventsPageComponent } from './routes/my-events-page/my-events-page.component';
import { NotificationsTableComponent } from './routes/notifications-page/components/notifications-table/notifications-table.component';
import { NotificationsPageComponent } from './routes/notifications-page/notifications-page.component';
import { routes } from './routes/routes';
import { UserEventsTableComponent } from './routes/user-page/components/user-events-table/user-events-table.component';
import { UserPageComponent } from './routes/user-page/user-page.component';
import { AddUserFormComponent } from './routes/users-page/components/add-user-form/add-user-form.component';
import { EditUserFormComponent } from './routes/users-page/components/edit-user-form/edit-user-form.component';
import { UsersTableComponent } from './routes/users-page/components/users-table/users-table.component';
import { UsersPageComponent } from './routes/users-page/users-page.component';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { NotificationsItemComponent } from './routes/notifications-page/components/notifications-item/notifications-item.component';

// @ts-ignore
window.jQuery = require('jquery');
// @ts-ignore
window.Bootstrap = require('bootstrap');

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventsPageComponent,
    DropdownMenuComponent,
    SidebarComponent,
    UsersPageComponent,
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
    UserPageComponent,
    AuthVkComponent,
    ProgressBarComponent,
    EventCardComponent,
    UserEventsTableComponent,
    AddEventButtonComponent,
    EditUserButtonComponent,
    EditEventButtonComponent,
    AttendeeTableComponent,
    InviteUserButtonComponent,
    NotificationsPageComponent,
    NotificationsTableComponent,
    RemoveAllNotificationsButtonComponent,
    SearchEventButtonComponent,
    ImageCropperComponent,
    UploadImageButtonComponent,
    MyEventsPageComponent,
    FormErrorComponent,
    NotificationsItemComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true }),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgSelectModule,
    FormsModule,
    DpDatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
