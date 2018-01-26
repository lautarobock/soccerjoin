import { Component, OnInit } from '@angular/core';
import { Session } from '../../services/session.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'sj-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor(
    public session: Session,
    private userService: UsersService
  ) { }

  ngOnInit() {
    
  }

}
