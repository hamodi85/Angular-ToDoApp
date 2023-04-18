import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router) { }


  onSubmit() {
    console.log(this.loginForm.value);
    const loginUser: User = {
      FirstName: null,
      LastName: null,
      Email: null,
      Username: this.loginForm.get('username')!.value || null,
      Password: this.loginForm.get('password')!.value || null,
    };
    if (this.loginForm.valid) {
      this.authService.login(loginUser).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.Message === 'Login successful') {
            localStorage.setItem('token', res.Token); 
            this.authService.setIsAuthenticated(true);
            this.authService.setUserId(res.UserId); 
            alert('Login successful');
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);
          } else if (res.Message) {
            alert(res.Message);
          } else {
            alert('An error occurred');
          }
        },
        error: (err: any) => {
          if (err.error && err.error.Message) {
            alert(err.error.Message);
          } else {
            alert('An error occurred');
          }
        }
      });
  
    }
  }
  
}