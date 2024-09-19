import { Component, OnInit } from '@angular/core';
import { UserLogged } from '../../services/auth/user';
import { LoginService } from '../../services/auth/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule]
})
export class AboutComponent implements OnInit {
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
