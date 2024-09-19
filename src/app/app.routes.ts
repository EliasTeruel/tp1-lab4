import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterComponent } from './auth/register/register.component';
import { AhorcadoComponent } from './games/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './games/mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './games/preguntados/preguntados.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'games/ahorcado', component: AhorcadoComponent },
  { path: 'games/mayor-o-menor', component: MayorOMenorComponent },
  { path: 'games/preguntados', component: PreguntadosComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
