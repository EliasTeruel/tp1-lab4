import { Component } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  userInfo: any;

  constructor(private authService: LoginService) { }

  ngOnInit() {
    this.authService.userInfo$.subscribe((user) => {
      if (user) {
        this.userInfo = user;
      }
      else { console.log("error"); }
    });
  }
}

