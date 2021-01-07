import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthService} from '../auth.service';
import {tap} from 'rxjs/operators';
import {noop} from 'rxjs';
import {Router} from '@angular/router';
import {AppState} from '../../../shared/reducers';
import {login} from '../auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  form: FormGroup;

  constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router,
      private store: Store<AppState>) {

      this.form = fb.group({
          email: ['test@superstore.com', [Validators.required]],
          password: ['test', [Validators.required]]
      });

  }


  login(): void {

      const val = this.form.value;

      this.auth.login(val.email, val.password)
          .pipe(
              tap(user => {

                  console.log(user);

                  this.store.dispatch(login({user}));

                  this.router.navigateByUrl('/dashboard');

              })
          )
          .subscribe(
              noop,
              () => alert('Login Failed')
          );



  }

}

