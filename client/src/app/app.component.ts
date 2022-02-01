import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUserObject } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  users !: IUserObject[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getUsers();
  }
  
  getUsers() {
    this.http.get<IUserObject[]>('https://localhost:5001/api/users').subscribe(data => {
      console.log(data);
      this.users = data.sort((a, b) => a.userName.localeCompare(b.userName));
    })
  }
}
