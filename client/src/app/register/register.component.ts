import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm !: FormGroup;
  maxDate !: Date;

  constructor(
    private user$: UserService, 
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(4)])
      ],
      gender: ['male', Validators.compose([
        Validators.required])
      ],
      knownAs: ['', Validators.compose([
        Validators.required])
      ],
      dateOfBirth: ['', Validators.compose([
        Validators.required])
      ],
      city: ['', Validators.compose([
        Validators.required])
      ],
      country: ['', Validators.compose([
        Validators.required])
      ],
      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(8)])
      ],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        this.matchPasswords('password')])
      ]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchPasswords(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value && control.parent && control.parent.controls) {
        return control.value === (control.parent.controls as { [key: string]: AbstractControl })[matchTo].value ? null: { isMatching: true };
      } else { return null; }
    }
  }

  register() {
    this.user$.register(this.registerForm.value).subscribe(res => {
      this.router.navigateByUrl('/members');
    }, error => {
      console.log(error);
    });
  }

  back() {
    this.cancelRegister.emit();
  }
}
