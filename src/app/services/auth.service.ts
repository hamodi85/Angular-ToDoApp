import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'https://localhost:7168/api/User';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
}



  login(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/authenticate`, user);
  }

  signUp(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, user);
  }

  setIsAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.setIsAuthenticated(false);
  }
  
}
