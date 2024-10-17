import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpsonsService {
  
  private apiUrl = 'https://thesimpsonsquoteapi.glitch.me/quotes';

  constructor(private http: HttpClient) {}


getRandomCharacters(count: number = 4): Observable<any[]> {
  const requests = Array(count).fill(null).map(() => 
    this.http.get<any>(`${this.apiUrl}?count=1`)
  );
  return forkJoin(requests);
}
}