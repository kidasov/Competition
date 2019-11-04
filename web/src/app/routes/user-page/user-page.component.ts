import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  faEnvelope,
  faLink,
  faPencilAlt,
  faStar,
  faSyncAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from 'app/consts/common';
import { Event as ModelEvent } from 'app/models/event';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import { UserService } from 'app/services/user';
import { Id } from 'app/types/types';
import $ from 'jquery';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  faPencilAlt = faPencilAlt;
  faSyncAlt = faSyncAlt;
  faUserCircle = faUserCircle;
  faEnvelope = faEnvelope;
  faStar = faStar;
  faLink = faLink;
  user: User;
  subscription: Subscription = new Subscription();
  userSubscription: Subscription;
  currentUserId: Id;
  events: ModelEvent[] = [];
  authorized: boolean;
  sidebarActions: string[] = ['edit'];

  editForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
  });

  editTtwForm = new FormGroup({
    ttwUrl: new FormControl(),
  });

  @ViewChild('cropper', { static: false })
  cropper: ImageCropperComponent;
  data = {};
  cropperSettings = new CropperSettings({
    width: 100,
    height: 100,
    croppedWidth: 100,
    croppedHeight: 100,
    canvasWidth: 400,
    canvasHeight: 300,
    noFileInput: true,
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
  ) {}

  fileChangeListener($event) {
    const image = new Image();
    const file = $event.target.files[0];
    const myReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      this.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  get ttwLink() {
    return `http://r.ttw.ru/players/?id=${this.user.ttwId}`;
  }

  fetchEvents() {
    const userId = this.route.snapshot.params.userId;
    this.userService.getEvents(userId).subscribe(events => {
      this.events = events;
    });
  }

  ngOnInit() {
    this.subscription = combineLatest(
      this.authProvider.userInfo,
      this.route.params,
    )
      .pipe(
        switchMap(([userInfo, params]) => {
          this.currentUserId = userInfo.userId;
          this.authorized = userInfo.authorized;
          this.fetchEvents();
          if (this.currentUserId === +params.userId) {
            return this.userService.currentUser;
          }
          return this.userService.getUser(params.userId);
        }),
      )
      .subscribe(user => {
        this.user = new User(user);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get currentUser() {
    const userId = +this.route.snapshot.params.userId;
    return this.currentUserId === userId;
  }

  handleLogout() {
    this.authProvider.invalidateSessionKey();
  }

  closeTtwPopup() {
    $('#editTtwModal').modal('hide');
  }

  handleTtwUrl(event: Event) {
    const target = event.target as HTMLInputElement;
    const regex = /http\:\/\/r\.ttw\.ru\/players\/\?id=([0-9a-f]+)/;
    const match = target.value.match(regex);

    if (match != null) {
      target.value = match[1];
      this.editTtwForm.get('ttwUrl').setValue(match[1]);
    }
  }

  saveTtw(event: Event) {
    const ttwId = this.editTtwForm.get('ttwUrl').value || this.user.ttwId;
    if (ttwId) {
      this.userService
        .patchUser(this.user.id, {
          ttwId,
        })
        .subscribe(() => {
          this.closeTtwPopup();
        });
    } else {
      this.closeTtwPopup();
    }
  }

  get hasAvatar() {
    return this.user && this.user.avatarMediaId !== null;
  }

  get avatar() {
    return `${API_URL}/storage/${this.user.avatarMediaId}`;
  }
}
