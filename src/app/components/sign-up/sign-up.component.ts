import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  
  formGroup: FormGroup
  
  constructor(
    public router: Router,
    public auth: AuthService,
    private formBuilder: FormBuilder
  ){
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });      
  }
  
  onSubmit(){
    if(this.formGroup.valid) {
      const name = this.formGroup.get('name')?.value
      const email = this.formGroup.get('email')?.value
      const password = this.formGroup.get('password')?.value
      if(email && password) this.auth.signUp(name, email, password)
    }
  }

}
