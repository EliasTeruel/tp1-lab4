import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogged } from '../../services/auth/user';
import { LoginService } from '../../services/auth/login.service';
import { FirebaseError } from 'firebase/app';

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
  //loginForm: FormGroup;
  isLoggedIn: boolean = false;
  firstName: string = "";
  lastName: string = "";
  registerForm: FormGroup;

  constructor(public auth: Auth,
    private router: Router,
    private userLogged: UserLogged,
    private authService: LoginService,
    private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      newUserMail: ['', [Validators.required, Validators.email]],
      newUserPWD: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    setTimeout(() => {
      const userInfo = localStorage.getItem('swapUserMail');
      if (userInfo) {
        this.registerForm.patchValue({
          newUserMail: userInfo
        });
        console.log("Correo agregado desde localStorage:", userInfo);
        localStorage.removeItem('swapUserMail')
      } else {
        console.log("No se encontró correo en localStorage");
      }
    }, 0);

    this.authService.loginStatus$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  get userMail() {
    return this.registerForm.get('newUserMail');
  }

  get userPWD() {
    return this.registerForm.get('newUserPWD');
  }



  async Register() {
    this.isLoading = true;
    const { newUserMail, newUserPWD, firstName, lastName } = this.registerForm.value;
  
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
  
      const res = await createUserWithEmailAndPassword(this.auth, newUserMail, newUserPWD);
  
      if (res.user.email !== null) {
        const userData = { email: newUserMail, firstName, lastName };
  
        await this.authService.updateUserInfo(userData);
        await this.authService.login(newUserMail, newUserPWD);
        await this.router.navigate(['/home']);
      }
      
      this.flagError = false; 
    } catch (error) {
      const e = error as FirebaseError;
      this.flagError = true; 
      switch (e.code) {
        case 'auth/email-already-in-use':
          this.msjError = 'Email ya en uso';
          break;
        case 'auth/invalid-email':
          this.msjError = 'Email inválido';
          break;
        case 'auth/missing-password':
          this.msjError = 'Contraseña faltante';
          break;
        default:
          this.msjError = 'Error desconocido';
          break;
      }
    } finally {
      this.isLoading = false; 
    }
  }
  
  
}  

