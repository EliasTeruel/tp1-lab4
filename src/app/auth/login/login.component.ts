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

  constructor(public auth: Auth,
    private firestore: Firestore,
    private authService: LoginService,
    private router: Router,
    private userLogged: UserLogged,
    private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      userMail: ['', [Validators.required, Validators.email]],
      userPWD: ['', [Validators.required]]
    });
    this.authService.loginStatus$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
  get userName() {
    return this.loginForm.get('userName');
  }

  get userMail() {
    return this.loginForm.get('userMail');
  }

  get userPWD() {
    return this.loginForm.get('userPWD');
  }


  autoCompleteUser() {
    const userName = this.loginForm.get('userName')?.value;
    console.log('usuario con el nombre:', userName);
  
    if (userName) {
      this.getUserByUserName(userName).subscribe((users: any) => {
        console.log('Usuarios encontrados:', users);
  
        if (users && users.length > 0) {
          const user = users[0]; 
          console.log('Usuario encontrado:', user); 
          this.loginForm.patchValue({
            userMail: user.email, 
            userPWD: user.password || ''
          });
        } else {
          console.log('Usuario no encontrado');
          
        
      }
      });
    }
  }
  

  getUserByUserName(userName: string) {
    console.log('Ejecutando consulta con userName:', userName);
  
    const userCollection = collection(this.firestore, 'users');
    const userQuery = query(userCollection, where('firstName', '==', userName));
    const result = collectionData(userQuery);
    
    result.subscribe({
      next: (data: any) => console.log('Resultado de Firestore:', data),
      error: (error: any) => console.error('Error en Firestore:', error)
    });
    
    return result;
  }
  
 


  Login() {
    
    if (this.loginForm.valid) {
      signInWithEmailAndPassword(this.auth, this.loginForm.value.userMail, this.loginForm.value.userPWD)
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
            this.userNotFound = false;
          }
        })
        .catch((e) => {
          console.log("en catch "+e.code);
          if (e.code === 'auth/invalid-credential') {
            this.userNotFound = true;
          }
        });
    }
  }


  Register() {
    const userName = this.userName?.value;
  const userMail = this.userMail?.value;

  this.authService.setTempUserInfo(userMail, userName).then(() => {
    this.router.navigate(['/register']);
  });
}
}
