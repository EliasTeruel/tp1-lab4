import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NavComponent } from "../../shared/nav/nav.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/auth/login.service';
import { LoginComponent } from "../../auth/login/login.component";
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChatComponent } from '../chat/chat.component';
import * as bootstrap from 'bootstrap';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, CommonModule, LoginComponent, HeaderComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('alertModal', { static: true }) alertModal!: ElementRef;
  constructor(private router: Router, private authService: LoginService) {}

  jugarJuego(juego: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([`/games/${juego}`]);
    } else {
      this.abrirModal();
    }
  }
  abrirModal() {
    const modalElement = this.alertModal.nativeElement;
    const modal = new (bootstrap as any).Modal(modalElement);
    modal.show();
  }
  
  cerrarModal() {
    const modalElement = this.alertModal.nativeElement;
    const modal = (bootstrap as any).Modal.getInstance(modalElement);
    modal?.hide();
  }
  
}
