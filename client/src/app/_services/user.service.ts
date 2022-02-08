import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IUser } from '../_models/user';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<IUser>(this.baseUrl+'account/login', model).pipe(
      map(res => {
        const user = res;
        if (user) this.setCurrentUser(user);
      })
    );
  }

  register(model: any) {
    return this.http.post<IUser>(this.baseUrl+'account/register', model).pipe(
      map(res => {
        const user = res;
        if (user) this.setCurrentUser(user);
      })
    );
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
  }
}
