import { Component, AfterViewInit } from '@angular/core';
import { NavComponent } from "../../shared/nav/nav.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/auth/login.service';
import { LoginComponent } from "../../auth/login/login.component";
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChatComponent } from '../chat/chat.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, CommonModule, LoginComponent, HeaderComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router, private authService: LoginService) {}

  jugarJuego(juego: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([`/games/${juego}`]);
    } else {
      alert('Por favor, inicie sesión para jugar.');
    }
  }
}
