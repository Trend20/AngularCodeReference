import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Cookie} from 'ng2-cookies';
import {Observable, of} from 'rxjs';
import {User} from "../auth/user";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  CURRENT_USER_KEY = 'current_user';
  ACCESS_TOKEN_KEY = 'access_token';
  REFRESH_TOKEN_KEY = 'refresh_token';
  CURRENT_BROKER_KEY = 'current_broker';

  constructor() { }

  isLoggedIn(): boolean {
    return Cookie.check(this.ACCESS_TOKEN_KEY);
  }

  getCurrentUser(): User | undefined {
    let user = localStorage.getItem(this.CURRENT_USER_KEY)
    
    return user ? JSON.parse(user) : undefined;
  }

  getCurrentBroker(): any | undefined {
    let broker = localStorage.getItem(this.CURRENT_BROKER_KEY);
    
    return broker  ? JSON.parse(broker) : undefined;
  }

  getAccessToken(): string {
    return Cookie.get(this.ACCESS_TOKEN_KEY);
  }
  getHeaders(): HttpHeaders {
    return  new HttpHeaders({
      Authorization: 'Bearer ' + this.getAccessToken()
    });
  }
  saveToken(token: any): Observable<boolean> {
    const expiryDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set(this.ACCESS_TOKEN_KEY, token.access_token, expiryDate);
    Cookie.set(this.REFRESH_TOKEN_KEY, token.refresh_token);
    return of(true);
  }
  setCurrentUser(user: User, brokerData ?: any)  {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.CURRENT_BROKER_KEY, JSON.stringify(brokerData));
  }
}
