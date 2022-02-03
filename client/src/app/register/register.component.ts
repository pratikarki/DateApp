import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};
  constructor(private user$: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register() {
    this.user$.register(this.model).subscribe(res => {
      this.back();
    }, error => {
      console.log(error.error);
      this.toastr.error(error.error);
    });
  }

  back() {
    this.cancelRegister.emit();
  }
}
