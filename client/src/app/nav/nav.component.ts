import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  
  constructor(public user$: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    this.user$.login(this.model).subscribe(res => {
      this.toastr.success('Logged in successfully');
      this.router.navigateByUrl('/members');
    }, error => {
      console.log(error.error);
      this.toastr.error(error.error);
    });
  }

  logout() {
    this.user$.logout();
    this.router.navigateByUrl('/');
    this.toastr.success('Logged out successfully');
  }

}
