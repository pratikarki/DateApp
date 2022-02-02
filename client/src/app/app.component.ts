import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUser, IUserObject } from './_models/user';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  users !: IUserObject[];

  constructor(private user$: UserService) { }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userObj = localStorage.getItem('user');
    if (userObj) {
      const user: IUser = JSON.parse(userObj);
      this.user$.setCurrentUser(user);
    }
  }
  
}
