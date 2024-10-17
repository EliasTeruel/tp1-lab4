
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { LoginComponent } from '../../auth/login/login.component';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, CommonModule, LoginComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  userLoginOn: boolean = false;
  constructor(private authService: LoginService, private auth: Auth, private router: Router) { }

  ngOnInit() {
    this.authService.loginStatus$.subscribe((isLoggedIn: boolean) => {

      this.userLoginOn = isLoggedIn;

    });
  }

  CloseSession() {
    this.authService.updateLoginStatus(false);
    this.auth.signOut().then(() => {
      this.router.navigate(['/home']);
      this.authService.updateUserInfo({ email: '', firstName: '', lastName: '' });

      console.log('Sesión cerrada');
    }).catch((error) => {
      console.error('Error al cerrar sesión', error);
    });
  }
}

