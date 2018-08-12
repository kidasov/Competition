import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes/routes';
import { EventsComponent } from './components/events/events.component';
import { EventCreateComponent } from './routes/event-create/event-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventsPage } from './routes/events-page/events-page.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UsersPage } from './routes/users-page/users-page.component';
import { HeaderComponent } from './components/header/header.component';
import { InputComponent } from './components/inputs/input/input.component';
import { FormComponent } from './components/form/form.component';
import { AddUserFormComponent } from './routes/users-page/components/add-user-form/add-user-form.component';
import { UsersTableComponent } from './routes/users-page/components/users-table/users-table.component';
import { ButtonComponent } from './components/button/button.component';
import { CloseComponent } from './components/icons/close/close.component';
import { EditUserFormComponent } from './routes/users-page/components/edit-user-form/edit-user-form.component';
import { EventsTableComponent } from './routes/events-page/components/events-table/events-table.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventCreateComponent,
    EventsPage,
    DropdownMenuComponent,
    SidebarComponent,
    UsersPage,
    HeaderComponent,
    InputComponent,
    FormComponent,
    AddUserFormComponent,
    UsersTableComponent,
    ButtonComponent,
    CloseComponent,
    EditUserFormComponent,
    EventsTableComponent,
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
