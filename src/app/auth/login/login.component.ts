import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { Subscription } from 'rxjs';
import { addDoc, collection, collectionData, Firestore, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { UserLogged } from '../../services/auth/user';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NavComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  userNotFound: boolean = false;
  showRegisterButton: boolean = false;
  errorMessage: string = '';

  constructor(public auth: Auth,
    private firestore: Firestore,
    private authService: LoginService,
    private router: Router,
    private userLogged: UserLogged,
    private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      userMail: ['', [Validators.required, Validators.email]],
      userPWD: ['', [Validators.required]]
    });
    this.authService.loginStatus$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  get userMail() {
    return this.loginForm.get('userMail');
  }

  get userPWD() {
    return this.loginForm.get('userPWD');
  }

  checkIfUserExists() {
    const email = this.userMail?.value;
    if (this.userMail?.valid) {
      this.authService.checkUserExists(email).then((exists: boolean) => {
        if (exists) {
          this.userNotFound = false;
          this.showRegisterButton = false;
        } else {
          this.userNotFound = true;
          this.showRegisterButton = true;
        }
      }).catch((error) => {
        console.error('Error al verificar el correo:', error);
      });
    }
  }

  quickLogin() {
    const savedUserMail = localStorage.getItem('savedUserMail');
    if (savedUserMail) {
      this.loginForm.patchValue({
        // userMail: savedUserMail,
        userMail: "g@gmail.com",
        userPWD: '123456'
      });
    } else {
      console.log("No hay usuario guardado para 'Ingreso rápido'");
    }
  }
  Login() {
    this.errorMessage = '';
    if (this.loginForm.valid && !this.userNotFound) {
      const { userMail, userPWD } = this.loginForm.value;
      this.authService.login(userMail, userPWD)
        .then(() => this.router.navigate(['/home']))
        .catch((e) => {
          console.log("---------- Login failed:    ", e);
        if (e.code === 'auth/user-not-found') {
          this.userNotFound = true;
          this.errorMessage = 'El usuario no está registrado.';
        } else if (e.code === 'auth/invalid-credential') {
          this.errorMessage = 'Contraseña o Email incorrecto.';
        } else {
          this.errorMessage = 'Error en el inicio de sesión. Inténtalo de nuevo.';
        }
        });
        setTimeout(() => {
          this.errorMessage = '';
        }, 1500);
    }
  }


  Register() {
    const userMail = this.userMail?.value;
    localStorage.setItem('swapUserMail', userMail);
    this.authService.setTempUserInfo(userMail).then(() => {
      this.router.navigate(['/register']);
    });
  }
  }

