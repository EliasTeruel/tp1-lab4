import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserLogged {
  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  private userInfo = new BehaviorSubject<{ email: string | null }>({ email: null });
  userInfo$ = this.userInfo.asObservable();

  updateLoginStatus(isLoggedIn: boolean) {
    this.loginStatus.next(isLoggedIn);
  }

  updateUserInfo(user: { email: string | null }) {
    this.userInfo.next(user);
  }

  getUserInfo() {
    return this.userInfo.getValue();
  }
}

