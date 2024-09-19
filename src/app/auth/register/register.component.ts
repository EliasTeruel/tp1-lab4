import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogged } from '../../services/auth/user';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  newUserMail: string = "";
  newUserPWD: string = "";
  loggedUser: string = "";
  flagError: boolean = false;
  msjError: string = "";
  isLoading: boolean = false;
  loginForm: FormGroup;
  isLoggedIn: boolean = false;
  firstName: string = "";
  lastName: string = "";

  constructor(public auth: Auth,
    private router: Router,
    private userLogged: UserLogged,
    private authService: LoginService,
    private fb: FormBuilder) {
    const userInfo = this.userLogged.getUserInfo();
    if (userInfo.email) {
      this.newUserMail = userInfo.email;
    }
    
    this.loginForm = this.fb.group({
      newUserMail: ['', [Validators.required, Validators.email]],
      newUserPWD: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
    this.authService.loginStatus$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  get userMail() {
    return this.loginForm.get('newUserMail');
  }

  get userPWD() {
    return this.loginForm.get('newUserPWD');
  }

  get userName() {
    return this.loginForm.get('newUserName');
  }

  Register() {
    this.isLoading = true;
    createUserWithEmailAndPassword(this.auth, this.loginForm.value.newUserMail, this.loginForm.value.newUserPWD).then((res) => {
      if (res.user.email !== null) {
        const userData = {
          email: res.user.email,
          firstName: this.loginForm.value.firstName,
          lastName: this.loginForm.value.lastName
        };
        this.authService.updateUserInfo(userData).then(() => {
          this.authService.updateLoginStatus(true);
          this.router.navigate(['/home']);
        });
      }

      this.flagError = false;
      setTimeout(() => {
        this.isLoading = false;
        this.Login();
      }, 3000);
    }).catch((e) => {
      this.isLoading = false;
      this.flagError = true;
      console.log(e);
      switch (e.code) {
        case 'auth/email-already-in-use':
          this.msjError = 'Email ya en uso';
          break;
        case 'auth/invalid-email':
          this.msjError = 'Email Invalido';
          break;
        case 'auth/missing-password':
          this.msjError = 'Contraseña faltante';
          break;
        default:
          this.msjError = 'Error';
          console.log("e.code: " + e.code);
          break;
      }
    })
  }

  Login() {
    setTimeout(() => {
      this.msjError = 'Registro Exitoso';
    }, 1000);
    signInWithEmailAndPassword(this.auth, this.loginForm.value.newUserMail, this.loginForm.value.newUserPWD)
    .then(async(res) => {
      if (res.user.email !== null) {
        const lastLogin = res.user.metadata?.lastSignInTime ? new Date(res.user.metadata.lastSignInTime) : null;
        const formattedLoginTime = lastLogin 
          ? `${lastLogin.toLocaleDateString()} ${lastLogin.toLocaleTimeString()}` 
          : 'Fecha no disponible';
          const userInfo = await this.authService.getUserInfoFromFirestore(res.user.email);

          if (userInfo) {
            const userData = { 
              email: userInfo.email, 
              firstName: userInfo.firstName, // Mantener el nombre existente
              lastName: userInfo.lastName, // Mantener el apellido existente
              lastLoginTime: formattedLoginTime // Solo actualizar la última hora de inicio de sesión
            };
         this.authService.updateUserInfo(userData).then(() => {
          this.authService.updateLoginStatus(true);
          this.router.navigate(['/home']);
        });
      }
      }

    }).catch((e) => console.log(e))
  }

}
