import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth/service';

@Component({
  selector: 'app-auth-vk',
  templateUrl: './auth-vk.component.html',
  styleUrls: ['./auth-vk.component.css'],
})
export class AuthVkComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code != null) {
      this.authService
        .vkSignIn({
          redirect_uri: 'http://localhost:4200/auth/vk',
          code,
        })
        .subscribe(response => {
          this.router.navigate(['users', response.userId]);
        });
    }
  }
}
