import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';

function nameValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const namePattern = /^[A-Za-z']+$/;
  if (!namePattern.test(control.value)) {
    return { invalidName: true };
  }
  return null;
}

function usernameValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const usernamePattern = /^[a-zA-Z0-9]+$/;
  if (!control.value.match(usernamePattern)) {
    return { invalidUsername: true };
  }
  return null;
}

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (!control.value.match(passwordPattern)) {
    return { invalidPassword: true };
  }
  return null;
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, nameValidator]),
    lastName: new FormControl('', [Validators.required, nameValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, usernameValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), passwordValidator]),
  });

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    console.log('Form submitted');
    const user: User = {
      FirstName: this.signUpForm.get('firstName')?.value || null,
      LastName: this.signUpForm.get('lastName')?.value || null,
      Email: this.signUpForm.get('email')?.value || null,
      Username: this.signUpForm.get('username')?.value || null,
      Password: this.signUpForm.get('password')?.value || null,
    };
  
    console.log(user);
  
    this.auth.signUp(user).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        if (!res) {
          console.error('Empty response body');
          alert('An error occurred');
        } else if (res.Message === 'User Registered') {
          alert(res.Message);
          this.signUpForm.reset();
          this.router.navigate(['/login']);
        } else {
          alert('An error occurred');
        }
      },
      error: (err: any) => {
        console.error(err);
        if (err instanceof HttpErrorResponse && err.error && err.error.Message) {
          alert(err.error.Message);
        } else {
          alert('An error occurred');
        }
      }
    });
  
  }
  
}
