import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../_models/user';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  model: any = {};
  
  constructor(public user$: UserService) { }

  ngOnInit(): void {
  }

  login() {
    this.user$.login(this.model).subscribe(res => {
    }, error => console.log(error.error));
  }

  logout() {
    this.user$.logout();
  }

}
