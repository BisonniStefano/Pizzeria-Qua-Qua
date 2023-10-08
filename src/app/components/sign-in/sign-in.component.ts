import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  formGroup: FormGroup

  constructor(
    public router: Router,
    public auth: AuthService,
    private formBuilder: FormBuilder
    ){
      this.formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });      
    }

    onSubmit(){
      if(this.formGroup.valid) {
        const email = this.formGroup.get('email')?.value
        const password = this.formGroup.get('password')?.value
        if(email && password) this.auth.signIn(email, password)
      }
    }

}
