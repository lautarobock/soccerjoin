import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Action } from '../../toolbar/toolbar.component';
import { EndomondoService } from '../../../services/endomondo.service';
import { UsersService } from '../../../services/users.service';
import { Session } from '../../../services/session.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'sj-endomondo-login',
  templateUrl: './endomondo-login.component.html',
  styles: [`
:host div {
  height: calc(100vh - 64px)
}
  `]
})
export class EndomondoLoginComponent implements OnInit {

  actions: Action[];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private endomondoService: EndomondoService,
    private userService: UsersService,
    private session: Session,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: '',
      password: ''
    });
    this.actions = [{
      styleName: 'fas fa-check',
      text: 'Login with endomondo',
      menu: false,
      click: () => this.login()
    }]
  }

  private login() {
    this.endomondoService.login(this.form.value.email, this.form.value.password).subscribe(auth => {
      this.userService.loginWithEndomondo(auth).subscribe(
        response => {
          this.session.registerToken(response.token);
          this.session.registerUser(response.user);
          this.router.navigate(['/home']);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.userService.signinWithEndomondo(auth).subscribe(
              response => {
                this.session.registerToken(response.token);
                this.session.registerUser(response.user);
                this.router.navigate(['/home']);
              }
            );
          } else {
            this.snackBar.open(err.message, 'CLOSE');
          }
        }
      );
    });
  }

}
