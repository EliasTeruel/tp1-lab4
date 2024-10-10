import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpsonsService {
  
  private apiUrl = 'https://thesimpsonsquoteapi.glitch.me/quotes';

  constructor(private http: HttpClient) {}

  getRandomCharacter(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?count=1`);
  }
}
