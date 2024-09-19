import { Component, AfterViewInit } from '@angular/core';
import { NavComponent } from "../../shared/nav/nav.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/auth/login.service';
import { UserLogged } from '../../services/auth/user';
import { LoginComponent } from "../../auth/login/login.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, CommonModule, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  images = [
    { src: '/ahorcado.png', alt: 'Juego 1' },
    { src: '/preguntados.png', alt: 'Juego 2' },
    { src: '/mayor-menor.png', alt: 'Juego 3' },
  ];
}
